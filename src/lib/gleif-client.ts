// GuardianOS GLEIF API Client - Real LEI Validation
// File: guardianos/src/lib/gleif-client.ts
// Based on: https://api.gleif.org/demo

interface GLEIFConfig {
  baseUrl: string;
  rateLimit: number; // 60 requests per minute per user
  timeout: number;
}

interface LEIRecord {
  lei: string;
  entity: {
    legalName: {
      name: string;
      language: string | null;
    };
    otherNames: string[];
    legalAddress: {
      addressLines: string[];
      city: string;
      region: string;
      country: string;
      postalCode: string;
    };
    headquartersAddress: {
      addressLines: string[];
      city: string;
      region: string;
      country: string;
      postalCode: string;
    };
    registeredAt: {
      id: string;
      other: string | null;
    };
    registeredAs: string;
    jurisdiction: string;
    category: string | null;
    legalForm: {
      id: string;
      other: string | null;
    };
    status: 'ACTIVE' | 'INACTIVE';
    expiration: {
      date: string | null;
      reason: string | null;
    };
  };
  registration: {
    initialRegistrationDate: string;
    lastUpdateDate: string;
    status: 'ISSUED' | 'PENDING_VALIDATION' | 'PENDING_TRANSFER' | 'LAPSED' | 'MERGED' | 'RETIRED';
    nextRenewalDate: string;
    managingLou: string;
    corroborationLevel: 'FULLY_CORROBORATED' | 'PARTIALLY_CORROBORATED' | 'PENDING_CORROBORATION';
  };
  bic?: string[];
}

interface LEIValidationResult {
  valid: boolean;
  lei: string;
  entityName: string;
  jurisdiction: string;
  status: string;
  registrationStatus: string;
  lastUpdated: string;
  confidence: number;
  details: LEIRecord | null;
  warnings: string[];
}

interface GLEIFSearchResult {
  data: Array<{
    type: string;
    id: string;
    attributes: LEIRecord;
  }>;
  meta: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

interface FuzzySearchResult {
  data: Array<{
    type: string;
    id: string;
    attributes: {
      lei: string;
      match: string;
      score: number;
    };
  }>;
}

export class GLEIFAPIClient {
  private config: GLEIFConfig;
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();

  constructor() {
    this.config = {
      baseUrl: 'https://api.gleif.org/api/v1',
      rateLimit: 60, // requests per minute
      timeout: 30000 // 30 seconds
    };
  }

  /**
   * Validate a specific LEI code
   */
  async validateLEI(lei: string): Promise<LEIValidationResult> {
    try {
      await this.checkRateLimit();

      const response = await fetch(`${this.config.baseUrl}/lei-records/${lei}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'User-Agent': 'GuardianOS/1.0'
        },
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (response.status === 404) {
        return {
          valid: false,
          lei,
          entityName: '',
          jurisdiction: '',
          status: 'NOT_FOUND',
          registrationStatus: 'NOT_FOUND',
          lastUpdated: '',
          confidence: 0,
          details: null,
          warnings: ['LEI not found in GLEIF database']
        };
      }

      if (!response.ok) {
        throw new Error(`GLEIF API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const record = data.data.attributes as LEIRecord;

      // Calculate confidence based on entity status and registration status
      const confidence = this.calculateConfidence(record);

      // Generate warnings
      const warnings = this.generateWarnings(record);

      return {
        valid: true,
        lei: record.lei,
        entityName: record.entity.legalName.name,
        jurisdiction: record.entity.jurisdiction,
        status: record.entity.status,
        registrationStatus: record.registration.status,
        lastUpdated: record.registration.lastUpdateDate,
        confidence,
        details: record,
        warnings
      };

    } catch (error) {
      console.error(`Error validating LEI ${lei}:`, error);
      return {
        valid: false,
        lei,
        entityName: '',
        jurisdiction: '',
        status: 'ERROR',
        registrationStatus: 'ERROR',
        lastUpdated: '',
        confidence: 0,
        details: null,
        warnings: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Search for entities by name (fuzzy matching)
   */
  async searchEntitiesByName(name: string, limit: number = 10): Promise<LEIValidationResult[]> {
    try {
      await this.checkRateLimit();

      // Use fuzzy completions for name matching
      const response = await fetch(
        `${this.config.baseUrl}/fuzzycompletions?field=entity.legalName&q=${encodeURIComponent(name)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'User-Agent': 'GuardianOS/1.0'
          },
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`GLEIF fuzzy search error: ${response.status} ${response.statusText}`);
      }

      const fuzzyData = await response.json() as FuzzySearchResult;
      
      // Get full records for the fuzzy matches
      const results: LEIValidationResult[] = [];
      
      for (const match of fuzzyData.data.slice(0, limit)) {
        const validation = await this.validateLEI(match.attributes.lei);
        if (validation.valid && validation.details) {
          // Add fuzzy match score
          validation.confidence = Math.min(validation.confidence, match.attributes.score);
          results.push(validation);
        }
      }

      return results;

    } catch (error) {
      console.error(`Error searching entities by name "${name}":`, error);
      return [];
    }
  }

  /**
   * Search entities by exact legal name
   */
  async searchEntitiesByExactName(name: string, limit: number = 10): Promise<LEIValidationResult[]> {
    try {
      await this.checkRateLimit();

      const response = await fetch(
        `${this.config.baseUrl}/lei-records?filter[entity.legalName]=${encodeURIComponent(name)}&page[size]=${limit}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'User-Agent': 'GuardianOS/1.0'
          },
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`GLEIF search error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as GLEIFSearchResult;
      
      const results: LEIValidationResult[] = [];
      
      for (const item of data.data) {
        const record = item.attributes;
        const confidence = this.calculateConfidence(record);
        const warnings = this.generateWarnings(record);

        results.push({
          valid: true,
          lei: record.lei,
          entityName: record.entity.legalName.name,
          jurisdiction: record.entity.jurisdiction,
          status: record.entity.status,
          registrationStatus: record.registration.status,
          lastUpdated: record.registration.lastUpdateDate,
          confidence,
          details: record,
          warnings
        });
      }

      return results;

    } catch (error) {
      console.error(`Error searching entities by exact name "${name}":`, error);
      return [];
    }
  }

  /**
   * Find LEI by BIC code
   */
  async findLEIByBIC(bic: string): Promise<LEIValidationResult | null> {
    try {
      await this.checkRateLimit();

      const response = await fetch(
        `${this.config.baseUrl}/lei-records?filter[bic]=${encodeURIComponent(bic)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'User-Agent': 'GuardianOS/1.0'
          },
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`GLEIF BIC search error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as GLEIFSearchResult;
      
      if (data.data.length === 0) {
        return null;
      }

      const record = data.data[0].attributes;
      const confidence = this.calculateConfidence(record);
      const warnings = this.generateWarnings(record);

      return {
        valid: true,
        lei: record.lei,
        entityName: record.entity.legalName.name,
        jurisdiction: record.entity.jurisdiction,
        status: record.entity.status,
        registrationStatus: record.registration.status,
        lastUpdated: record.registration.lastUpdateDate,
        confidence,
        details: record,
        warnings
      };

    } catch (error) {
      console.error(`Error finding LEI by BIC "${bic}":`, error);
      return null;
    }
  }

  /**
   * Get relationship data for an LEI (parent/child entities)
   */
  async getEntityRelationships(lei: string): Promise<{
    directParent: LEIValidationResult | null;
    ultimateParent: LEIValidationResult | null;
    directChildren: LEIValidationResult[];
  }> {
    try {
      await this.checkRateLimit();

      // Get the main record first to access relationship links
      const mainRecord = await this.validateLEI(lei);
      
      if (!mainRecord.valid) {
        return {
          directParent: null,
          ultimateParent: null,
          directChildren: []
        };
      }

      // Search for parent relationships
      const [directParentResponse, ultimateParentResponse, directChildrenResponse] = await Promise.allSettled([
        fetch(`${this.config.baseUrl}/lei-records?filter[owns]=${lei}`, {
          headers: { 'Accept': 'application/vnd.api+json' }
        }),
        fetch(`${this.config.baseUrl}/lei-records?filter[owns]=${lei}`, {
          headers: { 'Accept': 'application/vnd.api+json' }
        }),
        fetch(`${this.config.baseUrl}/lei-records?filter[ownedBy]=${lei}`, {
          headers: { 'Accept': 'application/vnd.api+json' }
        })
      ]);

      const result = {
        directParent: null as LEIValidationResult | null,
        ultimateParent: null as LEIValidationResult | null,
        directChildren: [] as LEIValidationResult[]
      };

      // Process children
      if (directChildrenResponse.status === 'fulfilled' && directChildrenResponse.value.ok) {
        const childrenData = await directChildrenResponse.value.json() as GLEIFSearchResult;
        for (const child of childrenData.data.slice(0, 10)) { // Limit to 10 children
          const childValidation = await this.validateLEI(child.attributes.lei);
          if (childValidation.valid) {
            result.directChildren.push(childValidation);
          }
        }
      }

      return result;

    } catch (error) {
      console.error(`Error getting relationships for LEI "${lei}":`, error);
      return {
        directParent: null,
        ultimateParent: null,
        directChildren: []
      };
    }
  }

  /**
   * Batch validate multiple LEIs
   */
  async validateLEIBatch(leis: string[]): Promise<Map<string, LEIValidationResult>> {
    const results = new Map<string, LEIValidationResult>();
    
    // Process in batches to respect rate limits
    const batchSize = 10;
    
    for (let i = 0; i < leis.length; i += batchSize) {
      const batch = leis.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (lei) => {
        const result = await this.validateLEI(lei);
        return { lei, result };
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          results.set(promiseResult.value.lei, promiseResult.value.result);
        }
      });

      // Rate limiting delay between batches
      if (i + batchSize < leis.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    return results;
  }

  /**
   * Search entities by country
   */
  async searchEntitiesByCountry(countryCode: string, limit: number = 50): Promise<LEIValidationResult[]> {
    try {
      await this.checkRateLimit();

      const response = await fetch(
        `${this.config.baseUrl}/lei-records?filter[entity.legalAddress.country]=${countryCode}&page[size]=${limit}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.api+json',
            'User-Agent': 'GuardianOS/1.0'
          },
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`GLEIF country search error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as GLEIFSearchResult;
      
      const results: LEIValidationResult[] = [];
      
      for (const item of data.data) {
        const record = item.attributes;
        const confidence = this.calculateConfidence(record);
        const warnings = this.generateWarnings(record);

        results.push({
          valid: true,
          lei: record.lei,
          entityName: record.entity.legalName.name,
          jurisdiction: record.entity.jurisdiction,
          status: record.entity.status,
          registrationStatus: record.registration.status,
          lastUpdated: record.registration.lastUpdateDate,
          confidence,
          details: record,
          warnings
        });
      }

      return results;

    } catch (error) {
      console.error(`Error searching entities by country "${countryCode}":`, error);
      return [];
    }
  }

  private calculateConfidence(record: LEIRecord): number {
    let confidence = 1.0;

    // Reduce confidence for inactive entities
    if (record.entity.status !== 'ACTIVE') {
      confidence -= 0.3;
    }

    // Reduce confidence for lapsed registrations
    if (record.registration.status === 'LAPSED') {
      confidence -= 0.4;
    } else if (record.registration.status !== 'ISSUED') {
      confidence -= 0.2;
    }

    // Reduce confidence for partial corroboration
    if (record.registration.corroborationLevel === 'PARTIALLY_CORROBORATED') {
      confidence -= 0.1;
    } else if (record.registration.corroborationLevel === 'PENDING_CORROBORATION') {
      confidence -= 0.2;
    }

    // Check if renewal is overdue
    if (record.registration.nextRenewalDate) {
      const renewalDate = new Date(record.registration.nextRenewalDate);
      const now = new Date();
      if (now > renewalDate) {
        confidence -= 0.2;
      }
    }

    return Math.max(0, confidence);
  }

  private generateWarnings(record: LEIRecord): string[] {
    const warnings: string[] = [];

    if (record.entity.status !== 'ACTIVE') {
      warnings.push(`Entity status is ${record.entity.status}`);
    }

    if (record.registration.status === 'LAPSED') {
      warnings.push('LEI registration has lapsed');
    } else if (record.registration.status !== 'ISSUED') {
      warnings.push(`Registration status is ${record.registration.status}`);
    }

    if (record.registration.corroborationLevel !== 'FULLY_CORROBORATED') {
      warnings.push(`Corroboration level is ${record.registration.corroborationLevel}`);
    }

    if (record.registration.nextRenewalDate) {
      const renewalDate = new Date(record.registration.nextRenewalDate);
      const now = new Date();
      if (now > renewalDate) {
        warnings.push('LEI renewal is overdue');
      } else {
        const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilRenewal <= 30) {
          warnings.push(`LEI renewal due in ${daysUntilRenewal} days`);
        }
      }
    }

    return warnings;
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceReset = now - this.lastResetTime;

    // Reset counter every minute
    if (timeSinceReset >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    // Check if we're at the rate limit
    if (this.requestCount >= this.config.rateLimit) {
      const waitTime = 60000 - timeSinceReset;
      console.warn(`GLEIF rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastResetTime = Date.now();
    }

    this.requestCount++;
  }
}

// Export singleton instance
export const gleifClient = new GLEIFAPIClient();
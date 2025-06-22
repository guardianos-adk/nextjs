import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Vote, Users, Shield } from "lucide-react";

export default function GuardianConsensusBlog() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {/* Back Navigation */}
      <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 no-underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Header */}
      <header className="mb-12 not-prose">
        <div className="guardian-badge mb-4">
          <Vote className="h-4 w-4 mr-2" />
          Cryptography
        </div>
        <h1 className="guardian-heading-1 mb-4">Guardian Consensus: Threshold Cryptography for Distributed Trust</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By GuardianOS</span>
          <span>•</span>
          <time dateTime="2025-06-08">June 8, 2025</time>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
        <Image
          src="/blog/guardian_consensus.jpg"
          alt="Guardian network achieving consensus"
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <p className="lead guardian-body-large">
          In a world where single points of failure can compromise entire systems, threshold cryptography emerges as the mathematical foundation for distributed trust. By requiring multiple guardians to collaborate before sensitive actions can be taken, we create a system where no single entity—no matter how trusted—can unilaterally compromise privacy or security.
        </p>

        <h2 className="guardian-heading-2">The Mathematics of Trust Distribution</h2>
        
        <p>
          Threshold cryptography, formalized by <a href="https://link.springer.com/chapter/10.1007/978-3-031-33386-6_13" target="_blank" rel="noopener noreferrer">Yvo Desmedt in 1994</a>, enables a cryptographic operation to be distributed among n parties such that any t of them can perform the operation, but fewer than t learn nothing. This (t,n)-threshold scheme forms the backbone of modern distributed security systems.
        </p>

        <p>
          The elegance of this approach lies in its flexibility. As documented by <a href="https://csrc.nist.gov/projects/threshold-cryptography" target="_blank" rel="noopener noreferrer">NIST's Multi-Party Threshold Cryptography project</a>, threshold schemes can be applied to any cryptographic primitive—from key generation to signing and encryption. This universality makes them ideal for blockchain applications where trust must be distributed across multiple parties.
        </p>

        <h2 className="guardian-heading-2">From Theory to Practice: The 3-of-5 Model</h2>

        <p>
          GuardianOS implements a 3-of-5 threshold scheme, carefully chosen to balance security with practicality. This configuration means:
        </p>

        <div className="guardian-info-card my-8">
          <div className="guardian-info-icon mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="guardian-heading-4">Why 3-of-5?</h3>
          <ul className="list-disc pl-6 space-y-2 guardian-body">
            <li><strong>Fault Tolerance:</strong> Up to 2 guardians can be offline without affecting operations</li>
            <li><strong>Security:</strong> At least 3 guardians must collude to compromise the system</li>
            <li><strong>Practicality:</strong> 5 guardians is manageable while providing geographic and jurisdictional diversity</li>
            <li><strong>Efficiency:</strong> Achieving consensus among 3 parties is computationally efficient</li>
          </ul>
        </div>

        <p>
          This configuration aligns with research showing that <a href="https://eprint.iacr.org/2022/1437" target="_blank" rel="noopener noreferrer">threshold schemes with t > n/2</a> provide optimal security guarantees while maintaining practical efficiency for real-world deployments.
        </p>

        <h2 className="guardian-heading-2">Technical Implementation: Shamir's Secret Sharing</h2>

        <p>
          At the heart of our guardian consensus mechanism lies Shamir's Secret Sharing (SSS), a cryptographic technique that splits a secret into multiple shares. As explained in <a href="https://en.wikipedia.org/wiki/Threshold_cryptosystem" target="_blank" rel="noopener noreferrer">threshold cryptography literature</a>, SSS uses polynomial interpolation to ensure that:
        </p>

        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>Secret Distribution:</strong> The private key is split into 5 shares using a degree-2 polynomial
          </li>
          <li>
            <strong>Share Independence:</strong> Each guardian receives one share that reveals nothing about the secret
          </li>
          <li>
            <strong>Threshold Recovery:</strong> Any 3 shares can reconstruct the polynomial and recover the secret
          </li>
          <li>
            <strong>Information Theoretic Security:</strong> With fewer than 3 shares, the secret is perfectly hidden
          </li>
        </ol>

        <h2 className="guardian-heading-2">Modern Advances: From RSA to BLS</h2>

        <p>
          The evolution of threshold cryptography has been remarkable. While early systems relied on RSA-based schemes, modern implementations leverage more efficient primitives. <a href="https://hackernoon.com/threshold-signatures-their-potential-in-blockchain-security-and-practical-applications" target="_blank" rel="noopener noreferrer">Recent research</a> highlights how threshold signatures have evolved:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="guardian-feature-card">
            <Shield className="h-8 w-8 text-primary mb-4" />
            <h3 className="guardian-heading-4">ECDSA Threshold Signatures</h3>
            <p className="guardian-body">
              Modern protocols enable threshold signing for Bitcoin and Ethereum transactions without modifying the underlying blockchain protocols.
            </p>
          </div>
          
          <div className="guardian-feature-card">
            <Vote className="h-8 w-8 text-primary mb-4" />
            <h3 className="guardian-heading-4">BLS Signatures</h3>
            <p className="guardian-body">
              BLS signatures offer unique aggregation properties, allowing multiple guardians' signatures to be combined into a single, compact signature.
            </p>
          </div>
        </div>

        <p>
          As noted in <a href="https://arxiv.org/html/2502.03247v1" target="_blank" rel="noopener noreferrer">recent benchmarks</a>, BLS-based schemes provide optimal performance for blockchain applications, with signature sizes remaining constant regardless of the number of signers.
        </p>

        <h2 className="guardian-heading-2">Guardian Selection and Governance</h2>

        <p>
          The selection of guardians is crucial for system security. Drawing from <a href="https://www.ingwb.com/binaries/content/assets/insights/themes/distributed-ledger-technology/ing-releases-multiparty-threshold-signing-library-to-improve-customer-security/threshold-signatures-using-secure-multiparty-computation.pdf" target="_blank" rel="noopener noreferrer">industry best practices</a>, GuardianOS implements a multi-faceted approach:
        </p>

        <blockquote className="border-l-4 border-primary pl-6 my-8 italic">
          "Threshold cryptosystems differ widely according to their needs for interaction among the parties. The most efficient schemes are non-interactive: when producing a digital signature, every party generates a 'share' of such a signature and disseminates it."
          <cite className="block mt-2 text-sm not-italic">— From <a href="https://link.springer.com/chapter/10.1007/978-3-031-33386-6_13" target="_blank" rel="noopener noreferrer">Multi-Party Threshold Cryptography</a></cite>
        </blockquote>

        <p>
          GuardianOS guardians are selected based on:
        </p>

        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Jurisdictional Diversity:</strong> Guardians from different regulatory jurisdictions (ECB, DNB, BaFin, FINMA, FCA)</li>
          <li><strong>Technical Capability:</strong> Proven ability to maintain high-availability infrastructure</li>
          <li><strong>Reputational Standing:</strong> Established entities with significant stakes in maintaining system integrity</li>
          <li><strong>Legal Framework:</strong> Clear legal agreements defining responsibilities and liabilities</li>
        </ul>

        <h2 className="guardian-heading-2">Real-World Applications</h2>

        <p>
          Threshold cryptography is already transforming how institutions manage digital assets. <a href="https://www.dynamic.xyz/blog/the-evolution-of-multi-signature-and-multi-party-computation" target="_blank" rel="noopener noreferrer">Industry analysis</a> shows that major platforms are adopting threshold schemes:
        </p>

        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Fireblocks:</strong> Achieved 8x improvement in transaction speed using MPC-CMP algorithms</li>
          <li><strong>ZenGo Wallet:</strong> Pioneered consumer MPC wallets with threshold signatures split between servers and client devices</li>
          <li><strong>Internet Computer:</strong> Uses threshold cryptography at its core for consensus and randomness generation</li>
        </ul>

        <h2 className="guardian-heading-2">Security Considerations</h2>

        <p>
          While threshold cryptography provides strong security guarantees, implementation details matter. <a href="https://crypto.stackexchange.com/questions/3286/relation-between-threshold-cryptosystem-and-secure-multiparty-computation" target="_blank" rel="noopener noreferrer">Research indicates</a> that combining threshold cryptography with homomorphic properties creates powerful primitives for secure computation.
        </p>

        <p>
          Key security considerations include:
        </p>

        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>Distributed Key Generation:</strong> Keys must be generated in a distributed manner to prevent any single party from knowing the complete key
          </li>
          <li>
            <strong>Proactive Security:</strong> Periodic refresh of key shares prevents long-term compromise
          </li>
          <li>
            <strong>Verifiable Secret Sharing:</strong> Guardians can verify their shares are correct without revealing the secret
          </li>
          <li>
            <strong>Robust Protocols:</strong> System continues functioning even if some guardians behave maliciously
          </li>
        </ol>

        <h2 className="guardian-heading-2">Performance and Scalability</h2>

        <p>
          Modern threshold cryptography implementations have overcome early performance limitations. As documented in <a href="https://arxiv.org/html/2502.03247v1" target="_blank" rel="noopener noreferrer">Thetacrypt benchmarks</a>, current systems can handle thousands of operations per second with sub-second latency.
        </p>

        <div className="guardian-card bg-gradient-to-br from-primary/5 to-primary/10 p-8 my-12">
          <h3 className="guardian-heading-3 mb-4">The Future of Guardian Networks</h3>
          <p className="guardian-body mb-4">
            As blockchain adoption accelerates, guardian networks will evolve to support:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>Dynamic Guardian Sets:</strong> Guardians can be added or removed without redistributing all shares</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>Cross-Chain Coordination:</strong> Guardian networks spanning multiple blockchains</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>AI-Enhanced Decision Making:</strong> Machine learning to detect anomalies requiring guardian intervention</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>Quantum-Resistant Schemes:</strong> Post-quantum threshold cryptography for long-term security</span>
            </li>
          </ul>
        </div>

        <h2 className="guardian-heading-2">Conclusion</h2>

        <p>
          Guardian consensus through threshold cryptography represents a fundamental shift in how we approach trust in digital systems. By distributing control among multiple parties while maintaining operational efficiency, we create systems that are both secure and practical.
        </p>

        <p>
          As <a href="https://en.wikipedia.org/wiki/Secure_multi-party_computation" target="_blank" rel="noopener noreferrer">secure multi-party computation</a> continues to evolve, the integration of threshold cryptography with blockchain technology will enable new forms of collaboration that were previously impossible. The 3-of-5 guardian model implemented by GuardianOS demonstrates that distributed trust is not just theoretical—it's a practical solution for today's compliance challenges.
        </p>
      </div>
    </article>
  );
}

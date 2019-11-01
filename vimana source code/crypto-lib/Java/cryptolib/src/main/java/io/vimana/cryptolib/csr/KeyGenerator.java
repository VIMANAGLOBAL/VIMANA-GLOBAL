package io.vimana.cryptolib.csr;

import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.CryptoNotValidException;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.BufferOverflowException;
import java.nio.ByteBuffer;
import java.security.*;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.DERPrintableString;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.x509.Extensions;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Generators for crypto keys and nounces
 *
 * @author al
 */
public class KeyGenerator {

    private final Logger log = LoggerFactory.getLogger(KeyGenerator.class);
    private final vimryptoParams params;

    public KeyGenerator(vimryptoParams params) {
        this.params = params;
    }

    /**
     * Generated true secure ECC key pair using scure random number generator
     *
     * @return
     */
    public KeyPair generateKeys() {
        KeyPair pair = null;
        ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec(params.getDefaultCurve());
        try {
            KeyPairGenerator g = KeyPairGenerator.getInstance("ECDSA", "BC");
            g.initialize(ecSpec, new SecureRandom());
            pair = g.generateKeyPair();
        } catch (NoSuchAlgorithmException | NoSuchProviderException | InvalidAlgorithmParameterException ex) {
            log.error(ex.getMessage());
        }
        return pair;
    }

    /**
     * Generate deterministic ECC key pair using defaultCurve and
     * passphrase.Well, obiously all the security depends on randomness of
     * passphrase!
     *
     * @param secretPhrase long enough and random enough pass phrase. You've
     * been warned!
     * @param salt some random number, recommened size is 16 bytes
     * @return EEC key pair
     */
    public KeyPair generateKeys(String secretPhrase, byte[] salt) throws CryptoNotValidException {
        KeyPair pair = null;
        byte[] hash = deriveFromPasssPhrase(secretPhrase, salt, 4096);

        ECParameterSpec spec = ECNamedCurveTable.getParameterSpec(params.getDefaultCurve());
        KeyPairGenerator g;
        try {
            g = KeyPairGenerator.getInstance("ECDSA", "BC");
            NotRandom srand = new NotRandom();
            srand.setSeed(hash);
            g.initialize(spec, srand);
            pair = g.generateKeyPair();
        } catch (NoSuchAlgorithmException | NoSuchProviderException | InvalidAlgorithmParameterException ex) {
            String msg = "Invalid key generation parameters.";
            log.error(msg, ex);
            throw new CryptoNotValidException(msg, ex);
        }
        return pair;
    }

    /**
     * Generate ECDSA PublicKey X509 encoded
     *
     * @param bytes
     * @return
     */
    public PublicKey createPublicKeyFromBytes(byte[] bytes) {
        PublicKey result = null;
        try {
            KeyFactory factory = KeyFactory.getInstance("ECDSA", "BC");
            result = factory.generatePublic(new X509EncodedKeySpec(bytes));
        } catch (InvalidKeySpecException | NoSuchProviderException | NoSuchAlgorithmException ex) {
            log.error(ex.getMessage());
        }
        return result;
    }

    /**
     * Simple deterministic key derivation function. It is one-way function. It
     * calsulates hash (defined in params) of secretPhrase.getBytes() and salt.
     * If there is not enough bytes (keyLen) it uses hash result and the same
     * salt agian and puts additional bytes to output.
     *
     * @param secretPhrase UTF-8 encoded string
     * @param salt random salt at least of 16 bytes
     * @param keyLen desired output lenght
     * @return array of bytes that is determined by secretPhrase ans salt. It is
     * hard to calculate secretPthrase from it becuase it uses string
     * cryptographical hashing function SHA-512
     * @throws CryptoNotValidException
     */
    public byte[] deriveFromPasssPhrase(String secretPhrase, byte[] salt, int keyLen) throws CryptoNotValidException {
        ByteBuffer bb = ByteBuffer.allocate(keyLen);
        int have_bytes = 0;
        byte[] input = secretPhrase.getBytes();
        try {
            MessageDigest hash = MessageDigest.getInstance("SHA-512");
            while (have_bytes < keyLen) {
                hash.update(input);
                hash.update(salt);
                byte[] digest = hash.digest();
                have_bytes += digest.length;
                try {
                    bb.put(digest);
                    input = digest;
                } catch (BufferOverflowException e) {
                    break;
                }
            }
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("Digest is not available", ex);
        }
        return bb.array();
    }

    public PKCS10CertificationRequest createX509CertificateRequest(KeyPair kp, CertificateRequestData certData, boolean allowCertSign, String challengePassword) throws IOException {
        PKCS10CertificationRequest cert_rq = null;
        PKCS10CertificationRequestBuilder cr_builder = new JcaPKCS10CertificationRequestBuilder(certData.getSubject(), kp.getPublic());
        cr_builder.setLeaveOffEmptyAttributes(true);
        cr_builder.addAttribute(PKCSObjectIdentifiers.pkcs_9_at_extensionRequest, certData.getExtensions());
        if (challengePassword != null && !challengePassword.isEmpty()) {
            DERPrintableString password = new DERPrintableString(challengePassword);
            cr_builder.addAttribute(PKCSObjectIdentifiers.pkcs_9_at_challengePassword, password);
        }
        try {
            ContentSigner cs = new JcaContentSignerBuilder(params.getSignatureAlgorythm()).setProvider("BC").build(kp.getPrivate());
            cert_rq = cr_builder.build(cs);
        } catch (OperatorCreationException ex) {
            log.error("Can not create content signer", ex);
        }
        return cert_rq;
    }
//    
//    public static  X509Certificate signCSR(PKCS10CertificationRequest csr){
//        return null;
//    }

    public X509Certificate createSerlfSignedX509v3(KeyPair kp, CertificateRequestData certData) throws IOException {
        X509Certificate cert = null;
        // yesterday
        Date validityBeginDate = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
        // in 2 years
        Date validityEndDate = new Date(System.currentTimeMillis() + 2 * 365 * 24 * 60 * 60 * 1000);
        BigInteger serial = BigInteger.valueOf(System.currentTimeMillis());
        SubjectPublicKeyInfo subPubKeyInfo = SubjectPublicKeyInfo.getInstance(kp.getPublic().getEncoded());
        X509v3CertificateBuilder certBuilder = new X509v3CertificateBuilder(certData.getSubject(),
                serial,
                validityBeginDate,
                validityEndDate,
                certData.getSubject(),
                subPubKeyInfo);
        Extensions exts = certData.getExtensions();
        for (ASN1ObjectIdentifier oid : exts.getExtensionOIDs()) {
            certBuilder.addExtension(exts.getExtension(oid));
        }
        try {
            ContentSigner cs = new JcaContentSignerBuilder(params.getSignatureAlgorythm()).setProvider("BC").build(kp.getPrivate());
            X509CertificateHolder holder = certBuilder.build(cs);
            // convert to JRE certificate
            JcaX509CertificateConverter converter = new JcaX509CertificateConverter();
            converter.setProvider(new BouncyCastleProvider());
            cert = converter.getCertificate(holder);
        } catch (OperatorCreationException | CertificateException ex) {
            log.error("Can not create content signer", ex);
        }
        return cert;
    }
}

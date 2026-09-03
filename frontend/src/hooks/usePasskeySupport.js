import { useState, useEffect } from "react";
import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  platformAuthenticatorIsAvailable,
} from "@simplewebauthn/browser";

export const usePasskeySupport = () => {
  const [support, setSupport] = useState({
    supportsWebAuthn: true,
    supportsAutofill: false,
    isPlatformAvailable: false,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const checkSupport = async () => {
      try {
        const hasWebAuthn = browserSupportsWebAuthn();
        let hasAutofill = false;
        let hasPlatform = false;

        if (hasWebAuthn) {
          // Check autofill and platform authenticator in parallel
          const [autofillRes, platformRes] = await Promise.allSettled([
            browserSupportsWebAuthnAutofill(),
            platformAuthenticatorIsAvailable(),
          ]);

          hasAutofill =
            autofillRes.status === "fulfilled" ? autofillRes.value : false;
          hasPlatform =
            platformRes.status === "fulfilled" ? platformRes.value : false;
        }

        if (isMounted) {
          setSupport({
            supportsWebAuthn: hasWebAuthn,
            supportsAutofill: hasAutofill,
            isPlatformAvailable: hasPlatform,
            isLoading: false,
          });
        }
      } catch (err) {
        console.error("Failed to detect WebAuthn / Passkey support:", err);
        if (isMounted) {
          setSupport({
            supportsWebAuthn: false,
            supportsAutofill: false,
            isPlatformAvailable: false,
            isLoading: false,
          });
        }
      }
    };

    checkSupport();

    return () => {
      isMounted = false;
    };
  }, []);

  const platformCopy = support.isPlatformAvailable
    ? "Touch ID, Face ID, or Windows Hello"
    : "Your phone or a security key";

  return {
    ...support,
    platformCopy,
  };
};

export default usePasskeySupport;

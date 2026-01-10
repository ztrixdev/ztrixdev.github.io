# Developing a proof of concept local-only secrets manager for Android
### Author: Alexander S.

## The Problem
In the modern world, where our daily life is daily rooted into the internet, a trustworthy password manager is crucial.
A password manager helps to get rid of the popular "one-passsword-for-all" habit. Having such a habit means that one is using a single or a couple of 
character combinations that they have strongly memorized as a password for every website they use. This comes from the person not
wanting to memorize a lot of different combinations, not trusting their memory or lacking a software to keep all of their various passwords safely stored and organized.
A password manager can securely store information about dozens of accounts, and the user only needs to remember one password - the Master Password.

There are a lot of robust solutions on the market right now, the most popular being KeePass, Authy, Proton and Bitwarden.
All of the above are capable, but are dependant on the client having an unrestricted internet access and the server being always-on and stable.
This creates a valid concern on personal data safety. The user is putting themselves into a situation when they rely on a third-party service to keep their important and sensitive information intact, 
which can be undesirable depending on a user's philosophical standpoint or a political situation in the user's country.
But what if we completely remove the server variable from the secrets managing process?
>_Passwords are too sensitive to store on a remote cloud. Data leaks happen, politics change and you never know which other service will be unavailable in your region tomorrow... Sure, you can self-host a password manager like Vaultwarden, but that requires either a rented VPS or a 24/7 running home server. In addition to that, maintaining the stability of such a solution... Ain't nobody got time for that, am I right?_

- © Passhaven's English [README](https://github.com/ztrixdev/PasshavenApp/blob/main/README.md)

And from this idea, Passhaven has emerged. It has been designed to be secure, reliable, easy to use, and, most importantly - usable without an internet access.
With Passhaven, one has the opportunity to view and manage all of their sensitive information without WiFi or celluar data, just their smartphone.

## Tech stack
In order to develop a mobile application, one needs a strong technical foundation.  
For Passhaven, four of the following dependencies are to be met:
- A database, needed to store the vault's content.
- A framework to interact with the hardware cryptographic module for encryption.
- A backend service, allowing the UI to communicate with the database.
- A modern and consistent UI toolkit, to make the app appealing and easy to use.

Currently, there are 3 mainstream frameworks used to build an Android app:
|Name|UI toolkit|Language|Is native?|
|-|-|-|-|
|React Native|React Components|JavaScript/TypeScript|✅ Partially|
|Flutter|Flutter UI|Dart|❌ No|
|Android Native|Jetpack Compose|Kotlin/Java|✅ Yes|

For a security-focused app like Passhaven, choosing a framework as native to Android as possible is essential. 
While Flutter excels at creating sleek UIs, it lacks the necessary infrastructure for implementing a database and backend service efficiently. 
React Native uses Android's native UI components, however, it still runs in a JavaScript runtime, complicating integration with Android's built-in Room database.

## pHbe and pHbeKt
Right after I have chosen the tech stack, I began drafting a cryptographic module in C++, a language I had experience working with,
and a language considered by many as a great, if not the best, tool for encryption-related software, planning to integrate it into the app using JNA.
I was thinking to make my app modular by design - the database, the cryptography, the frontend - all were supposed to be independently developed, so, the fact that my cryptographic module 
would have not been written in the same language as the app itself did not bother me. Hence the name pHbe, which stands for passHaven backend.
It has been decided to use libsodium to derive a key from the user's master password, and then use the derived key to encrypt and decrypt the database fields.
However, after making myself familiar with the fact that C++ is not compatible with JNA, as it is used to execute C code, and not C++, I have decided to rewrite the
encryption module in Kotlin.  
  
As soon I had finished rewriting pHbe in Kotlin (hence the pHbeKt), I have run into my first issue, being: "How do I store the derived key in the database?".
The database could be compromised, and a key leak would expose all the secrets stored in the database.
It seems like there's a logical solution - just to not store it, you can derive the key everytime you log into the app. If you store only the salt (which is public by design), you will get the same key if the password is correct.
While it may appear sensible, the derivation proccess is extremely mathematically complex, and it takes a long time to complete.
Such an approach also restricts any alternative login methods, such as a PIN-code, from being implemented.

The solution was to generate a secret key using Android's KeyStore - a hardware-backed cryptographic module in Android, encrypt the MP-derived key 
with it and store it in the database. This way, it can only be accessed on this specific device using a key stored in a hardware module, making a key leak highly unlikely.


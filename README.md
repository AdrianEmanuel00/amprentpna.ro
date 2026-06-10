# Amprent PNA

Website static pentru Amprent PNA, pregatit pentru gazduire pe `amprentpna.ro`.

## Deploy prin cPanel

Repo-ul include `.cpanel.yml`, folosit de cPanel Git Version Control pentru deployment.

Flux recomandat:

1. Modifici site-ul local.
2. Faci commit si push in GitHub.
3. In cPanel, intri la Git Version Control.
4. Apesi `Update from Remote`.
5. Apesi `Deploy HEAD Commit`.

Directorul implicit de deploy este:

```bash
$HOME/public_html/
```

Daca domeniul `amprentpna.ro` este addon domain sau are alt document root, schimba linia `DEPLOYPATH` din `.cpanel.yml`.

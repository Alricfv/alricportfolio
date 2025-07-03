# DNS Configuration for GitHub Pages with HTTPS

To properly configure your custom domain (alric.tech) with GitHub Pages and enable HTTPS, you need to set up the following DNS records:

## Required DNS Records

### For Apex Domain (alric.tech)

#### A Records (IPv4)
Point your apex domain to GitHub Pages' IP addresses:
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

#### AAAA Records (IPv6)
For IPv6 support and full HTTPS functionality:
```
AAAA    @    2606:50c0:8000::153
AAAA    @    2606:50c0:8001::153
AAAA    @    2606:50c0:8002::153
AAAA    @    2606:50c0:8003::153
```

### For www Subdomain (www.alric.tech)

#### CNAME Record
```
CNAME    www    alricfv.github.io.
```
(or your actual GitHub username's github.io domain)

## GitHub Pages Setup

1. Make sure your repository has a `CNAME` file in the `/docs` folder containing just `alric.tech`
2. In your GitHub repository settings:
   - Go to Settings > Pages
   - Ensure custom domain is set to `alric.tech`
   - Check "Enforce HTTPS" once the domain is verified

## Verifying Your Setup

### DNS Verification (Windows PowerShell)

Check A records:
```powershell
Resolve-DnsName -Name alric.tech -Type A
```

Check AAAA records:
```powershell
Resolve-DnsName -Name alric.tech -Type AAAA
```

Check CNAME record:
```powershell
Resolve-DnsName -Name www.alric.tech -Type CNAME
```

### HTTP to HTTPS Redirect Test

1. Try accessing your site via HTTP: `http://alric.tech`
2. It should automatically redirect to HTTPS: `https://alric.tech`

### SSL Certificate Check

Once GitHub has provisioned your SSL certificate, you can verify it by:

1. Clicking the padlock icon in your browser when visiting your site
2. Looking for "Let's Encrypt" as the certificate issuer
3. Ensuring the certificate is valid for both `alric.tech` and `www.alric.tech`

## Note on Propagation

After adding AAAA records, it may take up to 24 hours for:
1. DNS changes to fully propagate
2. GitHub to detect the changes
3. GitHub to issue an SSL certificate for your domain

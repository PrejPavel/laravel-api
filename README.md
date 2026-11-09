# About InfoRozvrh

Něco prostě na telku prostě chápeš 😎😎😎😎

- Nevím co dělám ✅
- Používám PHP framework se kterým jsem nikdy nedělal ✅
- Všechno z Reactu jsem zapomněl ✅
- Pomoc .·´¯`(>▂<)´¯`·. ✅

## Návod na setup

1. Composer.phar se stáhne z [Daunload Kompouzeru](https://getcomposer.org/download/) <-- tady dole z latest stable
2. narvat to do PHP v xampp složce
3. nalinkovat nějak php složku a composer v phpstormu
4. na něco k composer ALT + 96
   ```bash
   php C:\xampp\php\composer.phar install
   ```
5. na React  *Prosím nepřeklepávej to na <strong>isntall</strong> ja už to nedavam*
   ```bash
   npm install 
   ```
6. jeste copmoser install
   ```bash
   composer install --nevim jak se to pise si to nepamatuju 
   ```
7. nějaky encryption key, aby nebyly problemy potom to řvalo na mě se mi nelibilo
   ```bash
   php artisan key:generate 
   ```
8. nastavit .env soubor hlavně se prostě ujistit, že tam je mysql místo sqlite, no a vytvorit ho bo tam neni nevim jak to je
   ```bash
   cp .env.example .env
   ```
9. Na databazi
   ```bash
   php artisan migrate
   ```
10. A potom naplnit tu db seederama, classy jsou zatim jenom LayoutSeeder a ScreenSeeder
   ```bash
   php artisan db:seed --class=LayoutSeeder 
   ```

All security vulnerabilities will **not** be promptly addressed.

### neco pro github codespaces bo jinak mi to nefunguje
```JavaScript
host: '0.0.0.0',
        port: 5173, // Interní port v kontejneru
        strictPort: true,
        cors: true,
        hmr: {
            host: 'urban-goggles-v6wxgg6rjx6phw67x-5173.app.github.dev', // Proxy URL pro Vite, Změnit asi bo to podle mě nebude stejne
            clientPort: 443, // Tímto skryjete port :5173 z konce URL v prohlížeči!
            protocol: 'wss',
        },
```      

## License

nevim

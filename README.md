Git-manual

**Innan du börjar**

git switch main
git pull

**Skapa branch**

git switch -c typ/kort-beskrivning
Små bokstäver och bindestreck, inga å/ä/ö. Exempel: feature/produktsida

**Medan du jobbar**

git add .
git commit -m "Beskriv vad du gjort"
git push (om en ny branch ska pushas för första gången, använd: git push -u origin <feature/namnet-på-branchen>)



**När du är klar**

Öppna en Pull Request till main på GitHub.
Någon i teamet granskar och godkänner, sedan mergar du.
Ta bort branchen efteråt.

**Regler**

Pusha aldrig direkt till main.
En branch per uppgift.
Committa aldrig lösenord, nycklar eller .env-filer.
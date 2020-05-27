# Specification by example

## Förflyttning i 2048

4200< => 8400
2200< => 4000
4422< => 8400

När två brickor med samma valör kolliderar bildar de en ny bricka med summan av de två

Högst två brickor på samma rad eller kolumn slås ihop per drag

Brickor slås ihop närmast "väggen" först















## Markera flera checkboxar

[x] a
[ ] b
[x] c
[ ] d
[ ] e

Uppercase är med `shift` nedtryckt

a, c    => ac
a, c, E => acde
a, E    => abcde

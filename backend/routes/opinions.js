/*
to tez z tematem polaczone?
GET /topics/pending - tematy zatwierdzone ? jak sortowanie, filtrowanie w api ? moze argumetny w api [GET /topics?status=fraza]

Wymagania Członka KPK
1.	Zarządzanie opiniami
a)	[POST /topics/:uuid/approve] Jako Członek KPK chcę mieć możliwość zatwierdzenia tematów, których status jest Złożony, aby dopuścić je do dalszej realizacji.
b)	[POST /topics/:uuid/reject] Jako Członek KPK chcę mieć możliwość odrzucenia tematów, których status jest Złożony, aby wykluczyć z procesu propozycje niespełniające wymagań.

Wymagania Studenta
4.	Przeglądanie opinii
a)	[GET /topic/:uuid/opinion] Jako Student chcę mieć możliwość przeglądania uzasadnień opinii tematu, do którego jestem przypisany, aby dowiedzieć się, na co członek KPK zwrócił uwagę przy ocenie tematu.

Wymaganie Opiekuna
6.	Przeglądanie opinii
a)	[GET /topic/:uuid/opinion] Jako Opiekun chcę móc przeglądać uzasadnienia opinii dla tematów, którymi się opiekuję, żeby zdecydować, jakie zmiany wprowadzić do tematu, czy temat porzucić, czy go ponownie zgłosić po poprawie.

*/
/*
Wymagania poczty
1.	Wysyłanie wiadomości przez serwer pocztowy
a)	Jako poczta chcę mieć możliwość połączenia się z serwerem, aby wysłać powiadomienia do studentów oraz pracowników.
b)	Jako poczta chcę mieć możliwość wysyłania wiadomości do studentów oraz pracowników, aby powiadamiać ich m.in. o zmianach w wybranych tematach. 




Wymagania Członka KPK
2.	Przeglądanie tematów
a)	[GET /topics] Jako Członek KPK chcę mieć możliwość przeglądania tematów, aby mieć możliwość przejrzenia tematów, dla których będą wystawiane opinie.
b)	[GET /topics/:uuid] Jako Członek KPK chcę mieć możliwość wyświetlania szczegółów tematu, aby mieć możliwość ich sprawdzenia przed wystawieniem opinii.
c)	[GET /topics?search=fraza] Jako Członek KPK chcę mieć możliwość wyszukiwania tematów, aby znaleźć wybrany temat.


Wymagania Studenta
1.	Przeglądanie tematów
a)	[GET /topics?search=fraza] Jako Student chcę mieć możliwość wyszukania tematu aby szybko odnaleźć interesujący mnie temat.
b)	[GET /topics/:uuid] Jako Student chcę mieć możliwość przeglądania tematów, aby znaleźć interesujący mnie temat, który chciałbym realizować w ramach ZPI.
c)	[GET /topics/:uuid] Jako Student chcę mieć możliwość wyświetlania szczegółów tematu, aby mieć możliwość ich sprawdzenia jego szczegółów przed dopisaniem się do tematu.

Wymagania Studenta
2.	Zarządzanie przypisaniem do tematu
a)	[POST /topics/:uuid/join] Jako Student chcę mieć możliwość dopisania się do tematu, jeżeli jego status jest Otwarty oraz jeśli posiada on wolne miejsca, aby zaznaczyć chęć realizacji wybranego tematu ZPI.
b)	[DELETE /topics/:uuid/leave  ????] Jako Student chcę mieć możliwość usunięcia swojego dopisania do tematu, jeżeli jego status jest Otwarty, aby zmienić temat, który chcę realizować w ramach ZPI.


Wymaganie Opiekuna
1.	Zarządzanie tematem
a)	[POST /topics] Jako Opiekun chcę móc dodawać tematy do systemu, żeby wskazać, którymi z nich chcę się opiekować.
b)	[PUT /topics/:uuid] Jako Opiekun chcę mieć możliwość edycji tematów, którymi się opiekuje oraz których status to Otwarty lub Odrzucony.
c)	[DELETE /topics/:uuid] Jako Opiekun chcę mieć możliwość usunięcia tematów, którymi się opiekuje oraz którego status nie jest Zatwierdzony, aby wycofać temat, którym nie planuję się opiekować.


Wymaganie Opiekuna
2.	Zarządzanie opieką nad tematem
a)	[POST /topics/:uuid/assign] Jako Opiekun chcę mieć możliwość dodania swojej opieki nad tematem, którego status jest Otwarty lub Odrzucony i nie posiada opiekuna.
b)	[DELETE /topics/:uuid/unassign] Jako Opiekun chcę mieć możliwość usunięcia swojej opieki nad tematem, którego status jest Otwarty lub Odrzucony.


Wymaganie Opiekuna
3.	Zarządzanie składem zespołu
a)	[POST /topics/:uuid/students, payload {student_id ??}] Jako Opiekun chcę mieć możliwość dopisania studenta do tematów, którymi się opiekuje i których status to Otwarty lub Odrzucony, aby móc stworzyć grupę realizującą dany temat.
b)	[DELETE /topics/:uuid/students/:studentId] Jako Opiekun chcę mieć możliwość usunięcia studenta z tematu, którym się opiekuje, jeżeli jego status to Otwarty lub Odrzucony, aby wykreślić studenta, który nie będzie realizował danego tematu.

TO JUZ WYZEJ JEST WYPISANE

Wymaganie Opiekuna
7.	Przeglądanie tematów
a)	Jako Opiekun chcę mieć możliwość wyszukania tematu, aby szybko odnaleźć wybrany temat.
b)	Jako Opiekun chcę mieć możliwość przeglądania tematów, aby sprawdzić listę dostępnych tematów.
c)	Jako Opiekun chcę mieć możliwość wyświetlania szczegółów tematu, aby mieć możliwość ich sprawdzenia szczegółów tematu, którym się opiekuję.


Wymagania Opiekuna Studentów
2.	Przeglądanie tematów
a)	Jako Opiekun Studentów mieć możliwość przeglądania tematów, aby być w stanie wybrać temat do jakiego można dopisać studenta.
b)	Jako Opiekun Studentów chcę mieć możliwość wyszukania tematu, aby szybko odnaleźć wybrany temat.
c)	Jako Opiekun Studentów chcę mieć możliwość wyświetlania szczegółów tematu, aby mieć możliwość ich sprawdzenia szczegółów tematu, do którego mogę dopisać studenta.


Wymagania Opiekuna Studentów
4.	Zarządzanie przypisaniem studentów do tematów
a)	Jako Opiekun Studentów chcę mieć możliwość dopisania studenta do tematów, których status to Otwarty lub Odrzucony, aby dodać osoby, które nie są dopisane do żadnego tematu.
b)	Jako Opiekun Studentów chcę mieć możliwość usunięcia studenta z tematu, jeżeli jego status to Otwarty lub Odrzucony, żeby utrzymać w zespole tylko osoby zdolne do realizacji ZPI.

*/

import { Router } from "express";
import {
    getAllTopicsController,
    getTopicController,
} from "../controllers/topicsController.js";
import {
    joinTopicController,
    withdrawTopicController,
} from "../controllers/assignmentController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const topicRoutes = Router();

/**
topicRoutes.get("/", authenticateToken, getAllTopicsController);
topicRoutes.get("/:uuid", authenticateToken, getTopic);

topicRoutes.post("/", authenticateToken, requireRole(['Opiekun']), validateRequest(createTopicSchema), createTopicController);
topicRoutes.put("/:uuid", authenticateToken, requireRole(['Opiekun']), validateRequest(updateTopicSchema), updateTopicController);
topicRoutes.delete("/:uuid", authenticateToken, requireRole(['Opiekun']), deleteTopicController);
topicRoutes.post("/:uuid/assign", authenticateToken, requireRole(['Opiekun']), assignSupervisorController);
topicRoutes.delete("/:uuid/unassign", authenticateToken, requireRole(['Opiekun']), unassignSupervisorController);

topicRoutes.post("/:uuid/join", authenticateToken, requireRole(['Student']), joinTopicController);
topicRoutes.delete("/:uuid/leave", authenticateToken, requireRole(['Student']), leaveTopicController);

topicRoutes.post("/:uuid/students", authenticateToken, requireRole(['Opiekun', 'Opiekun Studentów']), addStudentToTopicController);
topicRoutes.delete("/:uuid/students/:studentId", authenticateToken, requireRole(['Opiekun', 'Opiekun Studentów']), removeStudentFromTopicController);
*/

topicRoutes.get("/", authenticateToken, getAllTopicsController);
topicRoutes.get("/:uuid", authenticateToken, getTopicController);
topicRoutes.post("/:uuid/join", authenticateToken, requireRole(['Student']), joinTopicController);
topicRoutes.delete("/:uuid/withdraw", authenticateToken, requireRole(['Student']), withdrawTopicController);


export default topicRoutes;

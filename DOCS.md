## Constants

<dl>
<dt><a href="#handleRefreshToken">handleRefreshToken</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: exchange refresh token (from cookie) for a new access token.</p>
<p>Expects the refresh token cookie <code>jwt</code> to be present. If missing returns 401.</p>
</dd>
<dt><a href="#generateAccessToken">generateAccessToken</a> ⇒ <code>string</code></dt>
<dd><p>Generate a short-lived access token for a user.</p>
<p>The token payload contains uuid, role and email and is signed with
the ACCESS_TOKEN_SECRET environment variable.</p>
</dd>
<dt><a href="#generateRefreshToken">generateRefreshToken</a> ⇒ <code>string</code></dt>
<dd><p>Generate a refresh token used to obtain new access tokens.</p>
<p>The refresh token is short-lived and only contains the user&#39;s uuid.</p>
</dd>
<dt><a href="#getTopicSignatures">getTopicSignatures</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Return signatures (users who signed a declaration) for a given topic UUID.</p>
</dd>
<dt><a href="#getAllTopics">getAllTopics</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Fetch all topics, optionally filtered by a search string.</p>
</dd>
<dt><a href="#getTopicByUuid">getTopicByUuid</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Fetch a single topic by UUID and return the mapped DTO.</p>
</dd>
<dt><a href="#updateStatus">updateStatus</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Update the status of a topic by its UUID.</p>
</dd>
<dt><a href="#getAllUsers">getAllUsers</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Fetch all users and map them to a public DTO containing role information.</p>
</dd>
<dt><a href="#updateUserLogin">updateUserLogin</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Update the last_login timestamp for a user (internal id) when they authenticate.</p>
</dd>
<dt><a href="#findUserByMail">findUserByMail</a> ⇒ <code>Promise.&lt;(Object|null)&gt;</code></dt>
<dd><p>Find a user by their email address.</p>
</dd>
<dt><a href="#findUserByUuid">findUserByUuid</a> ⇒ <code>Promise.&lt;(Object|null)&gt;</code></dt>
<dd><p>Find a user by their UUID.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getAllAcademicEmployeesController">getAllAcademicEmployeesController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return all academic employees.</p>
</dd>
<dt><a href="#getAcademicEmployeeController">getAcademicEmployeeController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return a single academic employee by user UUID.</p>
<p>Expects <code>req.params.uuid</code>.</p>
</dd>
<dt><a href="#joinTopicController">joinTopicController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: join a topic for the authenticated student.</p>
<p>Expects <code>req.params.uuid</code> to contain the topic UUID and <code>req.user.user_id</code>
to hold the authenticated user&#39;s internal id (middleware should attach it).
Responds with JSON success message on completion.</p>
</dd>
<dt><a href="#withdrawTopicController">withdrawTopicController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: withdraw the authenticated student from the given topic.</p>
<p>Expects <code>req.params.uuid</code> and <code>req.user.user_id</code> to be present. Returns
a JSON success message after the withdraw completes.</p>
</dd>
<dt><a href="#authenticateUser">authenticateUser(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: authenticate a user by email and set refresh cookie.</p>
<p>Expects <code>req.body.mail</code>. On success sets a httpOnly cookie with the
refresh token and returns the access token and user data in JSON.</p>
</dd>
<dt><a href="#verifyToken">verifyToken(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return basic info about the authenticated user.</p>
<p>The authentication middleware must attach <code>req.user</code> before this handler.</p>
</dd>
<dt><a href="#signDeclarationController">signDeclarationController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: sign the declaration for the authenticated student.</p>
<p>Expects <code>req.params.uuid</code> (topic UUID) and <code>req.user.user_id</code> (authenticated student id).
Calls the service which performs validation and signature creation. Returns
a JSON success message when complete.</p>
</dd>
<dt><a href="#addOpinionController">addOpinionController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: add an opinion for a given topic.</p>
<p>Expects <code>req.params.uuid</code> (topic UUID), <code>req.body.argumentation</code> and
<code>req.body.isPositive</code>, and <code>req.user.user_id</code> (authenticated employee id).
Returns a success message when the opinion is created and status updated.</p>
</dd>
<dt><a href="#getTopicSignaturesController">getTopicSignaturesController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return the signatures for a topic&#39;s declaration.</p>
<p>Expects <code>req.params.uuid</code> (topic UUID). Returns a DTO with <code>signatures</code> array.</p>
</dd>
<dt><a href="#getAllStudentsController">getAllStudentsController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return all students.</p>
</dd>
<dt><a href="#getStudentController">getStudentController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return a single student by user UUID.</p>
<p>Expects <code>req.params.userUuid</code> with the student&#39;s user UUID.</p>
</dd>
<dt><a href="#getStudentAssignmentController">getStudentAssignmentController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: check whether the given student has an assigned topic.</p>
<p>Expects <code>req.params.userUuid</code> and returns a boolean in the <code>data</code> field.</p>
</dd>
<dt><a href="#getAllTopicsController">getAllTopicsController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: get a list of topics, optionally filtered by a <code>search</code> query string.</p>
<p>Query params:</p>
<ul>
<li><code>search</code> (optional): case-insensitive substring to match topic names.</li>
</ul>
</dd>
<dt><a href="#getTopicController">getTopicController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return a single topic by UUID.</p>
<p>Expects <code>req.params.uuid</code> to contain the topic UUID.</p>
</dd>
<dt><a href="#getAllUsersController">getAllUsersController(req, res)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Controller: return all users in the system.</p>
</dd>
<dt><a href="#getAllAcademicEmployees">getAllAcademicEmployees()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Fetch all academic employees and map them to a lightweight DTO used by the API.</p>
<p>The DTO contains public user information and academic title data. This function
queries the database for academic employees and returns the mapped array.</p>
</dd>
<dt><a href="#getAcademicEmployee">getAcademicEmployee(uuid)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Fetch a single academic employee by the user&#39;s UUID and map to a DTO.</p>
</dd>
<dt><a href="#joinTopic">joinTopic(topicUuid, userId)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Join a topic by its UUID for a given user.</p>
<p>Validates that the topic exists, is in an open status, and that the
maximum student capacity hasn&#39;t been reached. On success the student&#39;s
record is updated to reference the topic.</p>
</dd>
<dt><a href="#withdrawTopic">withdrawTopic(topicUuid, userId)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Withdraw a student from a topic by topic UUID.</p>
<p>Validates that the topic exists and is in an open status, then
removes the topic relation from the student&#39;s record.</p>
</dd>
<dt><a href="#loginUser">loginUser(mail)</a> ⇒ <code>Promise.&lt;{user: Object, accessToken: string, refreshToken: string}&gt;</code></dt>
<dd><p>Authenticate a user by email and return access/refresh tokens.</p>
<p>This function looks up the user by email, throws if not found, generates
JWT tokens and updates the user&#39;s last_login timestamp.</p>
</dd>
<dt><a href="#refreshSession">refreshSession(refreshToken)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Refresh an access token using a valid refresh token.</p>
<p>Verifies the supplied refresh token and returns a newly signed access token.</p>
</dd>
<dt><a href="#signDeclaration">signDeclaration(topicUuid, userId)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Sign the declaration attached to a topic on behalf of a student.</p>
<p>Validates that the topic and its declaration exist and that the topic is
in the PREPARING status. Ensures a student cannot sign more than once.
After creating the signature, if the number of signatures reaches the
required threshold (all signatures), the topic status is
advanced to SUBMITTED.</p>
</dd>
<dt><a href="#addOpinion">addOpinion(topicUuid, argumentation, isPositive, userId)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Add an opinion for a topic and update the topic status according to the opinion.</p>
<p>Validates that the topic exists and is in the &#39;SUBMITTED&#39; status, then
creates an opinion record and updates the topic status to APPROVED or REJECTED
based on the <code>isPositive</code> flag.</p>
</dd>
<dt><a href="#mapSignatureToDto">mapSignatureToDto(declaration)</a> ⇒ <code>Object</code></dt>
<dd><p>Map a declaration record (with nested signatures) into a DTO containing
an array of signature authors.</p>
</dd>
<dt><a href="#findStatus">findStatus(statusName)</a> ⇒ <code>Promise.&lt;(Object|null)&gt;</code></dt>
<dd><p>Find a status record by its status name.</p>
<p>This is a thin helper around the Prisma client.</p>
</dd>
<dt><a href="#getAllStudents">getAllStudents()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Return all students mapped to a public DTO.</p>
<p>Each DTO includes basic user information, index number and ECTS deficit.</p>
</dd>
<dt><a href="#getStudent">getStudent(userUuid)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Get a single student by the user&#39;s UUID and map to a DTO.</p>
</dd>
<dt><a href="#checkIfStudentHasTopic">checkIfStudentHasTopic(userUuid)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check whether a student (identified by user UUID) currently has a topic assigned.</p>
</dd>
<dt><a href="#mapTopicToDto">mapTopicToDto(topic)</a> ⇒ <code>Object</code></dt>
<dd><p>Map a full topic entity from the database into a public DTO used by the API.</p>
<p>The DTO intentionally flattens nested relations (student/user/employee/opinion)
into an easy-to-consume shape for the frontend.</p>
</dd>
<dt><a href="#formatUserResponse">formatUserResponse(user)</a> ⇒ <code>Object</code></dt>
<dd><p>Format an internal user record to the response shape used by controllers.</p>
<p>This normalizes different role representations and returns only public fields.</p>
</dd>
</dl>

<a name="handleRefreshToken"></a>

## handleRefreshToken ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: exchange refresh token (from cookie) for a new access token.Expects the refresh token cookie `jwt` to be present. If missing returns 401.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with new access token.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="generateAccessToken"></a>

## generateAccessToken ⇒ <code>string</code>
Generate a short-lived access token for a user.The token payload contains uuid, role and email and is signed withthe ACCESS_TOKEN_SECRET environment variable.

**Kind**: global constant  
**Returns**: <code>string</code> - Signed JWT access token.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | User object (must include uuid, mail and role.role_name). |

<a name="generateRefreshToken"></a>

## generateRefreshToken ⇒ <code>string</code>
Generate a refresh token used to obtain new access tokens.The refresh token is short-lived and only contains the user's uuid.

**Kind**: global constant  
**Returns**: <code>string</code> - Signed JWT refresh token.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | User object (must include uuid). |

<a name="getTopicSignatures"></a>

## getTopicSignatures ⇒ <code>Promise.&lt;Object&gt;</code>
Return signatures (users who signed a declaration) for a given topic UUID.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Object&gt;</code> - DTO with `signatures` array.  
**Throws**:

- <code>NotFoundError</code> When the topic or declaration is not found.


| Param | Type | Description |
| --- | --- | --- |
| topicUuid | <code>string</code> | UUID of the topic whose declaration signatures to fetch. |

<a name="getAllTopics"></a>

## getAllTopics ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Fetch all topics, optionally filtered by a search string.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - Array of topic DTOs.  

| Param | Type | Description |
| --- | --- | --- |
| [search] | <code>string</code> | Optional case-insensitive substring to filter topic names. |

<a name="getTopicByUuid"></a>

## getTopicByUuid ⇒ <code>Promise.&lt;Object&gt;</code>
Fetch a single topic by UUID and return the mapped DTO.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Topic DTO.  
**Throws**:

- <code>NotFoundError</code> When the topic doesn't exist.


| Param | Type | Description |
| --- | --- | --- |
| topicUuid | <code>string</code> | UUID of the topic to fetch. |

<a name="updateStatus"></a>

## updateStatus ⇒ <code>Promise.&lt;void&gt;</code>
Update the status of a topic by its UUID.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the update completes.  

| Param | Type | Description |
| --- | --- | --- |
| topicId | <code>string</code> | UUID of the topic to update. |
| newStatusId | <code>number</code> | Internal status id to set on the topic. |

<a name="getAllUsers"></a>

## getAllUsers ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Fetch all users and map them to a public DTO containing role information.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - Array of user DTOs.  
<a name="updateUserLogin"></a>

## updateUserLogin ⇒ <code>Promise.&lt;void&gt;</code>
Update the last_login timestamp for a user (internal id) when they authenticate.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the update completes.  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>number</code> | Internal database id of the user. |

<a name="findUserByMail"></a>

## findUserByMail ⇒ <code>Promise.&lt;(Object\|null)&gt;</code>
Find a user by their email address.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;(Object\|null)&gt;</code> - User record including role or null when not found.  

| Param | Type | Description |
| --- | --- | --- |
| userMail | <code>string</code> | The user's email to search for. |

<a name="findUserByUuid"></a>

## findUserByUuid ⇒ <code>Promise.&lt;(Object\|null)&gt;</code>
Find a user by their UUID.

**Kind**: global constant  
**Returns**: <code>Promise.&lt;(Object\|null)&gt;</code> - User record including role or null when not found.  

| Param | Type | Description |
| --- | --- | --- |
| userUuid | <code>string</code> | The UUID of the user to fetch. |

<a name="getAllAcademicEmployeesController"></a>

## getAllAcademicEmployeesController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return all academic employees.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with employees data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getAcademicEmployeeController"></a>

## getAcademicEmployeeController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return a single academic employee by user UUID.Expects `req.params.uuid`.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with employee data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="joinTopicController"></a>

## joinTopicController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: join a topic for the authenticated student.Expects `req.params.uuid` to contain the topic UUID and `req.user.user_id`to hold the authenticated user's internal id (middleware should attach it).Responds with JSON success message on completion.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with success message.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="withdrawTopicController"></a>

## withdrawTopicController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: withdraw the authenticated student from the given topic.Expects `req.params.uuid` and `req.user.user_id` to be present. Returnsa JSON success message after the withdraw completes.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with success message.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="authenticateUser"></a>

## authenticateUser(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: authenticate a user by email and set refresh cookie.Expects `req.body.mail`. On success sets a httpOnly cookie with therefresh token and returns the access token and user data in JSON.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with tokens and user.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="verifyToken"></a>

## verifyToken(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return basic info about the authenticated user.The authentication middleware must attach `req.user` before this handler.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with user data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="signDeclarationController"></a>

## signDeclarationController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: sign the declaration for the authenticated student.Expects `req.params.uuid` (topic UUID) and `req.user.user_id` (authenticated student id).Calls the service which performs validation and signature creation. Returnsa JSON success message when complete.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with success message.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="addOpinionController"></a>

## addOpinionController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: add an opinion for a given topic.Expects `req.params.uuid` (topic UUID), `req.body.argumentation` and`req.body.isPositive`, and `req.user.user_id` (authenticated employee id).Returns a success message when the opinion is created and status updated.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with success message.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getTopicSignaturesController"></a>

## getTopicSignaturesController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return the signatures for a topic's declaration.Expects `req.params.uuid` (topic UUID). Returns a DTO with `signatures` array.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with signatures data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getAllStudentsController"></a>

## getAllStudentsController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return all students.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with students data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getStudentController"></a>

## getStudentController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return a single student by user UUID.Expects `req.params.userUuid` with the student's user UUID.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with student data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getStudentAssignmentController"></a>

## getStudentAssignmentController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: check whether the given student has an assigned topic.Expects `req.params.userUuid` and returns a boolean in the `data` field.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with boolean result.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getAllTopicsController"></a>

## getAllTopicsController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: get a list of topics, optionally filtered by a `search` query string.Query params:- `search` (optional): case-insensitive substring to match topic names.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with topics data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getTopicController"></a>

## getTopicController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return a single topic by UUID.Expects `req.params.uuid` to contain the topic UUID.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with topic data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getAllUsersController"></a>

## getAllUsersController(req, res) ⇒ <code>Promise.&lt;Object&gt;</code>
Controller: return all users in the system.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - JSON response with users data.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |

<a name="getAllAcademicEmployees"></a>

## getAllAcademicEmployees() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Fetch all academic employees and map them to a lightweight DTO used by the API.The DTO contains public user information and academic title data. This functionqueries the database for academic employees and returns the mapped array.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - Array of academic employee DTOs.  
<a name="getAcademicEmployee"></a>

## getAcademicEmployee(uuid) ⇒ <code>Promise.&lt;Object&gt;</code>
Fetch a single academic employee by the user's UUID and map to a DTO.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Academic employee DTO.  
**Throws**:

- <code>NotFoundError</code> When the employee is not found.


| Param | Type | Description |
| --- | --- | --- |
| uuid | <code>string</code> | The UUID of the user linked to the academic employee. |

<a name="joinTopic"></a>

## joinTopic(topicUuid, userId) ⇒ <code>Promise.&lt;void&gt;</code>
Join a topic by its UUID for a given user.Validates that the topic exists, is in an open status, and that themaximum student capacity hasn't been reached. On success the student'srecord is updated to reference the topic.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the join operation completes.  
**Throws**:

- <code>NotFoundError</code> If the topic does not exist.
- <code>ValidationError</code> If the topic status is not open or the student limit is reached.


| Param | Type | Description |
| --- | --- | --- |
| topicUuid | <code>string</code> | The UUID of the topic to join. |
| userId | <code>number</code> | The internal database id of the user (student). |

<a name="withdrawTopic"></a>

## withdrawTopic(topicUuid, userId) ⇒ <code>Promise.&lt;void&gt;</code>
Withdraw a student from a topic by topic UUID.Validates that the topic exists and is in an open status, thenremoves the topic relation from the student's record.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the withdraw operation completes.  
**Throws**:

- <code>NotFoundError</code> If the topic does not exist.
- <code>ValidationError</code> If the topic status is not open.


| Param | Type | Description |
| --- | --- | --- |
| topicUuid | <code>string</code> | The UUID of the topic to withdraw from. |
| userId | <code>number</code> | The internal database id of the user (student). |

<a name="loginUser"></a>

## loginUser(mail) ⇒ <code>Promise.&lt;{user: Object, accessToken: string, refreshToken: string}&gt;</code>
Authenticate a user by email and return access/refresh tokens.This function looks up the user by email, throws if not found, generatesJWT tokens and updates the user's last_login timestamp.

**Kind**: global function  
**Throws**:

- <code>ValidationError</code> When mail is not provided.
- <code>NotFoundError</code> When the user with the given email does not exist.


| Param | Type | Description |
| --- | --- | --- |
| mail | <code>string</code> | Email address used for login. |

<a name="refreshSession"></a>

## refreshSession(refreshToken) ⇒ <code>Promise.&lt;string&gt;</code>
Refresh an access token using a valid refresh token.Verifies the supplied refresh token and returns a newly signed access token.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - Newly issued access token.  
**Throws**:

- <code>ForbiddenError</code> When the refresh token is invalid or user not found.


| Param | Type | Description |
| --- | --- | --- |
| refreshToken | <code>string</code> | The refresh token string from the cookie. |

<a name="signDeclaration"></a>

## signDeclaration(topicUuid, userId) ⇒ <code>Promise.&lt;void&gt;</code>
Sign the declaration attached to a topic on behalf of a student.Validates that the topic and its declaration exist and that the topic isin the PREPARING status. Ensures a student cannot sign more than once.After creating the signature, if the number of signatures reaches therequired threshold (all signatures), the topic status isadvanced to SUBMITTED.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the signature (and any status update) completes.  
**Throws**:

- <code>NotFoundError</code> When the topic or declaration is missing.
- <code>ValidationError</code> If the topic is not in PREPARING status or the user already signed.


| Param | Type | Description |
| --- | --- | --- |
| topicUuid | <code>string</code> | UUID of the topic whose declaration will be signed. |
| userId | <code>number</code> | Internal database id of the student signing. |

<a name="addOpinion"></a>

## addOpinion(topicUuid, argumentation, isPositive, userId) ⇒ <code>Promise.&lt;void&gt;</code>
Add an opinion for a topic and update the topic status according to the opinion.Validates that the topic exists and is in the 'SUBMITTED' status, thencreates an opinion record and updates the topic status to APPROVED or REJECTEDbased on the `isPositive` flag.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Resolves when the opinion is created and status is updated.  
**Throws**:

- <code>NotFoundError</code> When the topic is not found.
- <code>ValidationError</code> When the topic is not in the 'SUBMITTED' status.


| Param | Type | Description |
| --- | --- | --- |
| topicUuid | <code>string</code> | UUID of the topic to add an opinion for. |
| argumentation | <code>string</code> | The textual argumentation for the opinion. |
| isPositive | <code>boolean</code> | True for positive opinion, false for negative. |
| userId | <code>number</code> | Internal database id of the employee creating the opinion. |

<a name="mapSignatureToDto"></a>

## mapSignatureToDto(declaration) ⇒ <code>Object</code>
Map a declaration record (with nested signatures) into a DTO containingan array of signature authors.

**Kind**: global function  
**Returns**: <code>Object</code> - Object with a `signatures` array of simplified user info.  

| Param | Type | Description |
| --- | --- | --- |
| declaration | <code>Object</code> | Declaration record containing signatures. |

<a name="findStatus"></a>

## findStatus(statusName) ⇒ <code>Promise.&lt;(Object\|null)&gt;</code>
Find a status record by its status name.This is a thin helper around the Prisma client.

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Object\|null)&gt;</code> - The status record or null if not found.  

| Param | Type | Description |
| --- | --- | --- |
| statusName | <code>string</code> | The status_name value to look up (e.g. 'Otwarty'). |

<a name="getAllStudents"></a>

## getAllStudents() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Return all students mapped to a public DTO.Each DTO includes basic user information, index number and ECTS deficit.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - Array of student DTOs.  
<a name="getStudent"></a>

## getStudent(userUuid) ⇒ <code>Promise.&lt;Object&gt;</code>
Get a single student by the user's UUID and map to a DTO.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Student DTO.  
**Throws**:

- <code>NotFoundError</code> When the student is not found.


| Param | Type | Description |
| --- | --- | --- |
| userUuid | <code>string</code> | UUID of the user to fetch as a student. |

<a name="checkIfStudentHasTopic"></a>

## checkIfStudentHasTopic(userUuid) ⇒ <code>Promise.&lt;boolean&gt;</code>
Check whether a student (identified by user UUID) currently has a topic assigned.

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if the student has a topic, otherwise false.  

| Param | Type | Description |
| --- | --- | --- |
| userUuid | <code>string</code> | The UUID of the user to check. |

<a name="mapTopicToDto"></a>

## mapTopicToDto(topic) ⇒ <code>Object</code>
Map a full topic entity from the database into a public DTO used by the API.The DTO intentionally flattens nested relations (student/user/employee/opinion)into an easy-to-consume shape for the frontend.

**Kind**: global function  
**Returns**: <code>Object</code> - The topic DTO.  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | Topic record returned by Prisma with includes. |

<a name="formatUserResponse"></a>

## formatUserResponse(user) ⇒ <code>Object</code>
Format an internal user record to the response shape used by controllers.This normalizes different role representations and returns only public fields.

**Kind**: global function  
**Returns**: <code>Object</code> - Formatted user response.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | Internal user record (Prisma or already formatted). |


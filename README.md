## Running the Application

### With Docker (Full Stack)
```bash
docker-compose up --build
```

### Manual Setup
1. **Backend** (Terminal 1):
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database** (if not using Docker):
   - Make sure PostgreSQL is running
   - Run migrations: `npx prisma migrate dev --name init`
   - Generate client: `npx prisma generate`
   - Seed database: `npx prisma db seed`

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Database GUI: http://localhost:51212 (Prisma Studio)

---

## Docker Commands

**docker-compose up --build**                               - start docker frontend, backend, postgres [docker has to be opened]

**docker exec -it ZPI-postgres psql -U postgres -d appdb**  - entering the postgres database in container
**\dt**                                                     - listing tables

**docker exec -it ZPI-backend npx prisma migrate dev --name init** - execute new database migration

**docker compose exec backend npx prisma studio --browser none  --port 51212** - gui for databse (for render url add '?sslmode=require' at the end)

**docker compose exec backend npx prisma generate** - generate client, do it after migrations

**docker compose exec backend npx prisma db seed** - seeding docker database

**docker compose exec backend npx prisma migrate reset** - reset the database, and apply migrations again

### Unit tests

**docker build -t zpi-backend-test .**                      - build tests (do in backend)

**docker run -it --rm zpi-backend-test npm test**           - run tests with attached stdin and allocated TTY

**docker run --rm zpi-backend-test npm test -- --run**      - run tests once and exit


**docker compose exec backend npx vitest** - tests in already build container !!!!!!!!!!

**docker compose exec backend npx vitest run --reporter=verbose** - runs with each test descriptions

### Functional tests

**docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm cypress** - run functional tests

**docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm cypress --spec cypress/e2e/addOpinion.cy.js** - run one test file

### Generating API documentation with JSDoc

**npm install**

**npm run docs** - generate documentation into ./docs/api

**npm run docs:clean** - clean previously generated docs

**npm run docs:serve** - serve the documentation locally at http://localhost:8080

**npx jsdoc -c jsdoc.json** - run the generator with npx


**docker compose logs backend** - logs

**docker compose -f docker-compose.yml -f docker-compose.test.yml up --exit-code-from cypress**

render...
pre deploy command:npx prisma migrate deploy
npx prisma db seed - run manually in render shell
npm install && npx prisma generate && npm run build - w renderze

vite ignoruje zmienne, które mają inny prefiks niż VITE_ !!!


**docker compose -f docker-compose.yml -f docker-compose.test.yml up --force-recreate --renew-anon-volumes --exit-code-from cypress --abort-on-container-exit** - tests containers will be recreated everytime!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
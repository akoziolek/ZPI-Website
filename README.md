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

### Functional tests

**docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm cypres** - run functional tests

render...
pre deploy command:npx prisma migrate deploy
npx prisma db seed - run manually in render shell
npm install && npx prisma generate && npm run build - w renderze
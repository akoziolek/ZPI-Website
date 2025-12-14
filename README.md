Ctr+Shift+V                                                 - pretty .md file preview

**docker-compose up --build**                               - start docker frontend, backend, postgres

**docker exec -it ZPI-postgres psql -U postgres -d appdb**  - entering the postgres database in container
**\dt**                                                     - listing tables

**docker exec -it ZPI-backend npx prisma migrate dev --name init** - execute new database migration

**docker compose exec backend npx prisma studio --browser none  --port 51212** - gui for databse 

**docker compose exec backend npx prisma generate** - generate client, do it after migrations

**docker compose exec backend npx tsx prisma/seed.ts** - seeding docker database

**docker compose exec backend npx prisma migrate reset** - reset the database, and apply migrations again



render...
pre deploy command:npx prisma migrate deploy
npx prisma db seed - run manually in render shell
npm install && npx prisma generate && npm run build - w renderze
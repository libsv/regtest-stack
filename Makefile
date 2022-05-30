SHELL=/bin/bash

# run with the latest production images
run-production:
	@docker-compose -f docker-compose.yml up --force-recreate

run-productiond:
	@docker-compose -f docker-compose.yml up -d --force-recreate

# stop development without clearing volumes etc
stop:
	@docker-compose down

# clears all volumes and images before stopping the local environment
clear:
	@docker image prune -a -f && \
	docker volume prune -f && \
	docker-compose down -v



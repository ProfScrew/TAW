
# Starts the docker network
start:
	@docker-compose up

# Stops the docker network
stop:
	@docker-compose down

# Stops the docker network and removes all images and volumes
clean:
	@docker-compose down --rmi all -v --remove-orphans

help:
	@echo "start: Starts the docker network"
	@echo "stop: Stops the docker network"
	@echo "clean: Stops the docker network and removes all images and volumes"
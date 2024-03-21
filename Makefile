.PHONY: lint
lint:
	@echo "==> Linting backend <=="
	# cd backend && npm i && npm run lint

	@echo "==> Linting UI <=="
	cd who-metrics-ui && npm i && npm run lint

.PHONY: clean
clean:
	@echo "==> cleaning <=="
	rm -rf backend/bin
	cd backend && go clean -cache -testcache -modcache

.PHONY: dev
dev:
	@echo "==> Generating data"
	cd backend && npm i && npm run start && cd .. && cd who-metrics-ui && npm i && npm run dev

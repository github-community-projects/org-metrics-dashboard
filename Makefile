# Before using, configure goproxy; see https://goproxy.githubapp.com/setup.
.PHONY: all
all: run

.PHONY: run
run: build
	@echo "==> running metrics <=="
	./backend/bin/metrics

.PHONY: build
build: metrics

tools:
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.51.2
	./scripts/install-tools.sh

.PHONY: test
test:  test-go

.PHONY: lint
lint: tools vet
	@echo "==> linting Go code <=="
	cd backend && golangci-lint run ./...

.PHONY: vet
vet:
	@echo "==> vetting Go code <=="
	cd backend && go vet ./...

.PHONY: clean
clean:
	@echo "==> cleaning <=="
	rm -rf backend/bin
	cd backend && go clean -cache -testcache -modcache

.PHONY: metrics
metrics:
	@echo "==> building metrics <=="
	cd backend && go build -o ./bin/metrics ./cmd

test-go:
	@echo "==> running Go tests <=="
	CGO_ENABLED=1 cd backend && go test -p 64 -race ./...

dev:
	@echo "==> Generating data"
	cd backend && go build -o ./bin/metrics ./cmd && cd .. && ./backend/bin/metrics && cd who-metrics-ui && npm i && npm run dev

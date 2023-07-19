# First stage: build the rust app
FROM rust AS builder

WORKDIR app
COPY . .

RUN cargo build --features admin_only

# Second stage
FROM ubuntu as runtime
RUN apt-get update && \
    apt-get install -y openssl libssl-dev libpq-dev ca-certificates protobuf-compiler

# ENV DEBIAN_FRONTEND=noninteractive
ENV RUN_MODE=production

COPY --from=builder /app/tmp/. /usr/local/bin/dlus/
COPY --from=builder /app/target/debug/dlus-serenity /usr/local/bin/dlus/

ENTRYPOINT /usr/local/bin/dlus/dlus-serenity

# # if we want to keep the container running
# CMD ["tail", "-f", "/dev/null"]
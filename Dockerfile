# First stage: build the rust app
FROM rust AS builder

# RUN apt-get -y update && \
#     apt-get -y install libgtk-3-dev

WORKDIR app
COPY . .

RUN cargo build --features admin_only --release

# Second stage
FROM alpine:latest as runtime
ENV DEBIAN_FRONTEND=noninteractive
# RUN	apt-get -y update && \
#     apt-get -y install libgtk-3-dev && \
#     apt-get -y install ca-certificates libssl-dev libpq-dev

COPY --from=builder /app/tmp/. /usr/local/bin/dlus/
COPY --from=builder /app/target/release/dlus-serenity /usr/local/bin/dlus/

# For Ubuntu we must symlink the libssl and libcrypto
# but we can't do it in the Dockerfile out of the ENTRYPOINT
# NOTE: For ARM arch, the folder is /lib/aarch64-linux-gnu/
# For AMD64 arch, the folder is /lib/x86_64-linux-gnu/

# Also when running the Hunter-related executable we must provide the second argument 
# of the config root.
ENTRYPOINT \
# ln -s -f /lib/x86_64-linux-gnu/libssl.so.3 /usr/lib/libssl.so.1.1 && \
# ln -s -f /lib/x86_64-linux-gnu/libcrypto.so.3 /usr/lib/libcrypto.so.1.1 && \
/usr/local/bin/dlus/dlus-serenity

# # if we want to keep the container running
# CMD ["tail", "-f", "/dev/null"]
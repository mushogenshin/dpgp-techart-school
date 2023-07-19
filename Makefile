image:
	docker rm -f dpgp-dlus && docker rmi -f dlus-serenity && \
	docker build -t dlus-serenity . && \
	docker run -d --name dpgp-dlus dlus-serenity

production:
	RUN_MODE=production cargo run --features firebase admin_only --release

dlus:
	# testing with firestore
	cargo run --features firebase

# dlus-no-fs:
# 	# without firestore
# 	cargo test run_dlus_without_firestore -- --show-output	
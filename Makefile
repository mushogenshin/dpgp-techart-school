dlus:
	# testing with firestore
	cargo run --features firebase

production:
	RUN_MODE=production cargo run --features firebase admin_only --release

# dlus-no-fs:
# 	# without firestore
# 	cargo test run_dlus_without_firestore -- --show-output	

dlus-image:
	docker rm -f dpgp-dlus && docker rmi -f dlus-serenity && \
	docker build -t dlus-serenity -f Dockerfile.DLUS . && \
	docker run -d --name dpgp-dlus dlus-serenity

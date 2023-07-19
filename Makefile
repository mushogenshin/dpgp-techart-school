image:
	docker rm -f dpgp-dlus && docker rmi -f dlus-serenity && \
	docker build -t dlus-serenity . && \
	docker run -d --name dpgp-dlus \
	-e FIRESTORE_KEY_FILE=/usr/local/bin/dlus/key.json \
	-e GOOGLE_PROJECT_ID=musho-genshin \
	dlus-serenity

production:
	RUN_MODE=production cargo run --features admin_only --release

dlus:
	# testing with firestore
	cargo run 

# dlus-no-fs:
# 	# without firestore
# 	cargo test run_dlus_without_firestore -- --show-output	
image:
	docker rmi -f dlus-serenity && \
	docker build -t dlus-serenity .

production:
	RUN_MODE=production cargo run --features admin_only --release

dlus:
	# testing with firestore
	cargo run 

# dlus-no-fs:
# 	# without firestore
# 	cargo test run_dlus_without_firestore -- --show-output	
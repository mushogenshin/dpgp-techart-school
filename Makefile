dlus:
	cargo run

dlus-no-fs:
	# without firestore
	cargo test run_dlus_without_firestore -- --show-output	
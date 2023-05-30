dlus:
	cargo run

dlus-no-fs:
	# no firestore
	cargo test run_dlus_without_firestore -- --show-output	
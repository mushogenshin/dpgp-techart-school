production:
	cargo run --features production --release

dlus:
	# testing with firestore
	cargo run 

dlus-no-fs:
	# without firestore
	cargo test run_dlus_without_firestore -- --show-output	
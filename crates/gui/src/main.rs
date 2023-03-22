use dotenv::dotenv;
use eframe::NativeOptions;
use gui::runtime_in_thread;
use gui::DlusApp;
use std::env;

fn main() {
    let (rt_handle, _rt_shutdown_tx, _tokio_thread) = runtime_in_thread();

    dotenv().ok();
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    let _ = eframe::run_native(
        "My Discord Bot",
        NativeOptions::default(),
        Box::new(|_cc| Box::new(DlusApp::with_runtime(token, rt_handle))),
    );

    // Sends message to shut down the tokio runtime.
    _rt_shutdown_tx
        .send(())
        .expect("Failed to shut down runtime thread");
    _tokio_thread.join().expect("tokio thread panicked");
}

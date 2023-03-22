use eframe::NativeOptions;
use gui::{start_client, DlusApp};

#[tokio::main]
async fn main() {
    use dotenv::dotenv;
    use std::env;

    dotenv().ok();
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    let http = start_client(&token)
        .await
        .expect("Failed to start Discord client");

    // let (rt_handle, _rt_shutdown_tx, _tokio_thread) = gui::runtime_in_thread();
    let rt_handle = tokio::runtime::Handle::current();

    let _ = eframe::run_native(
        "My Discord Bot",
        NativeOptions::default(),
        Box::new(|_cc| Box::new(DlusApp::with_runtime(http, rt_handle))),
    );

    // // Sends message to shut down the tokio runtime.
    // _rt_shutdown_tx
    //     .send(())
    //     .expect("Failed to shut down runtime thread");
    // _tokio_thread.join().expect("tokio thread panicked");
}

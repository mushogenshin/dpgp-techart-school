use dlus::init_bot;
#[allow(unused_imports)]
use dlus::log::{error, info};
use dlus::serenity::{http::Http, model::channel::Message, prelude::SerenityError};

use eframe::{egui, App};
use std::sync::Arc;
use tokio::runtime;

pub struct DlusApp {
    // client: Result<Client, SerenityError>,
    http: Arc<Http>,
    rt_handle: runtime::Handle,
}

impl DlusApp {
    pub fn with_runtime(http: Arc<Http>, rt_handle: runtime::Handle) -> Self {
        Self { http, rt_handle }
    }
}

impl App for DlusApp {
    fn update(&mut self, ctx: &eframe::egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.vertical_centered(|ui| {
                if ui.button("Send").clicked() {
                    //
                };
            });
        });
        // egui::Window::new("Hello World").show(ctx, |ui| {
        // });
    }
}

pub async fn start_client(token: &str) -> Result<Arc<Http>, SerenityError> {
    // Configure the client with your Discord bot token in the environment.
    let mut client = init_bot(&token).await?;

    let ctx = client.cache_and_http.clone().http.clone();

    tokio::spawn(async move {
        // Finally, start a single shard, and start listening to events.
        //
        // Shards will automatically attempt to reconnect, and will perform
        // exponential backoff until it reconnects.
        client.start().await.ok();
    });

    Ok(ctx)
}

// /// Use the channel sender to signify shutting down for the tokio runtime
// /// in other thread.
// pub fn runtime_in_thread() -> (
//     runtime::Handle,
//     tokio::sync::oneshot::Sender<()>,
//     std::thread::JoinHandle<()>,
// ) {
//     let (rt_shutdown_tx, rt_shutdown_rx) = tokio::sync::oneshot::channel();
//     let (rt_handle_tx, rt_handle_rx) = crossbeam_channel::bounded(0);

//     let tokio_thread = std::thread::spawn(move || {
//         let runtime = runtime::Runtime::new().expect("Failed to create the tokio runtime");
//         info!("tokio runtime created");

//         // Sending back the runtime handle to the main thread.
//         rt_handle_tx
//             .send(runtime.handle().clone())
//             .expect("Failed to give tokio runtime handle to the main thread");

//         runtime.block_on(async {
//             rt_shutdown_rx.await.expect("Error on the shutdown channel");
//         });

//         info!("tokio runtime finished");
//     });

//     // SAFETY: The `receiver.recv()` should only be called once.
//     let handle = rt_handle_rx
//         .recv()
//         .expect("Failed to receive tokio runtime handle via channel");
//     (handle, rt_shutdown_tx, tokio_thread)
// }

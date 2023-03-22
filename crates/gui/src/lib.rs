use dlus::init_bot;
#[allow(unused_imports)]
use dlus::log::{error, info};
use dlus::serenity::{client::Client, prelude::SerenityError};

use eframe::{egui, App};
use tokio::runtime;

pub struct DlusApp {
    client: Result<Client, SerenityError>,
    rt_handle: Option<runtime::Handle>,
}

impl DlusApp {
    pub fn with_runtime(token: String, rt_handle: runtime::Handle) -> Self {
        // Configure the client with your Discord bot token in the environment.
        let client = rt_handle.block_on(async move { init_bot(&token).await });
        Self {
            client,
            rt_handle: Some(rt_handle),
        }
    }
}

impl App for DlusApp {
    fn update(&mut self, ctx: &eframe::egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.vertical_centered(|ui| {
                ui.label("WIP");
                if ui.button("Tokio Runtime Handle").clicked() {
                    assert!(self.rt_handle.is_some());
                    assert!(self.client.is_ok());
                };
            });
        });
        // egui::Window::new("Hello World").show(ctx, |ui| {
        // });
    }
}

/// Use the channel sender to signify shutting down for the tokio runtime
/// in other thread.
pub fn runtime_in_thread() -> (
    runtime::Handle,
    tokio::sync::oneshot::Sender<()>,
    std::thread::JoinHandle<()>,
) {
    let (rt_shutdown_tx, rt_shutdown_rx) = tokio::sync::oneshot::channel();
    let (rt_handle_tx, rt_handle_rx) = crossbeam_channel::bounded(0);

    let tokio_thread = std::thread::spawn(move || {
        let runtime = runtime::Runtime::new().expect("Failed to create the tokio runtime");
        info!("tokio runtime created");

        // Sending back the runtime handle to the main thread.
        rt_handle_tx
            .send(runtime.handle().clone())
            .expect("Failed to give tokio runtime handle to the main thread");

        runtime.block_on(async {
            rt_shutdown_rx.await.expect("Error on the shutdown channel");
        });

        info!("tokio runtime finished");
    });

    // SAFETY: The `receiver.recv()` should only be called once.
    let handle = rt_handle_rx
        .recv()
        .expect("Failed to receive tokio runtime handle via channel");
    (handle, rt_shutdown_tx, tokio_thread)
}

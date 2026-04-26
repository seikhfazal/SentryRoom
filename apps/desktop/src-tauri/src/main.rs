#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                window.set_title("Sentinel Room")?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Sentinel Room desktop app");
}

fn main() {
    run();
}

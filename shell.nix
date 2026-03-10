{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Node.js and package manager
    nodejs

    # Rust toolchain for Tauri
    rustc
    cargo
    rustfmt
    clippy

    # Build tools
    pkg-config

    # Tauri dependencies
    webkitgtk_4_1
    gtk3
    glib
    glib-networking
    openssl
    libsoup_3

    # Additional system libraries
    cairo
    pango
    gdk-pixbuf
    atk

    # WebKit rendering dependencies
    gst_all_1.gstreamer
    gst_all_1.gst-plugins-base
    gst_all_1.gst-plugins-good
    gst_all_1.gst-plugins-bad
    fontconfig
    freetype
    harfbuzz
    libGL
    libxkbcommon
    wayland
    xorg.libX11
    xorg.libXrandr
    xorg.libXi
  ];

  shellHook = ''
    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
      pkgs.webkitgtk_4_1
      pkgs.gtk3
      pkgs.glib
      pkgs.openssl
      pkgs.libsoup_3
      pkgs.cairo
      pkgs.pango
      pkgs.gdk-pixbuf
    ]}:$LD_LIBRARY_PATH

    # Set up Rust environment
    export RUST_SRC_PATH="${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}"

    # Wayland display support
    export WAYLAND_DISPLAY="''${WAYLAND_DISPLAY:-wayland-1}"
    export XDG_RUNTIME_DIR="''${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

    # Fallback to X11 if Wayland fails
    export GDK_BACKEND=x11

    # Disable hardware acceleration (fixes blank window issues)
    export WEBKIT_DISABLE_COMPOSITING_MODE=1
    export WEBKIT_DISABLE_DMABUF_RENDERER=1

    echo "Tauri development environment loaded!"
    echo "Run 'npm run dev' to start the development server"
  '';
}

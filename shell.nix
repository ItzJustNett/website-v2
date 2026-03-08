{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
    rustup
    cargo
    rust-analyzer
    libxkbcommon
    libxcb
    xcb-util-cursor
    libxrandr
    libxinerama
    libxi
    libxext
    libxdamage
    mesa
    pkg-config
    fontconfig
    gtk3
    openssl
    webkitgtk
  ];

  shellHook = ''
    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
      pkgs.libxkbcommon
      pkgs.libxcb
      pkgs.libxrandr
      pkgs.libxinerama
      pkgs.libxi
      pkgs.libxext
      pkgs.libxdamage
      pkgs.mesa
      pkgs.gtk3
      pkgs.openssl
      pkgs.webkitgtk
    ]}:$LD_LIBRARY_PATH

    export PKG_CONFIG_PATH=${pkgs.lib.makeLibraryPath [
      pkgs.gtk3
      pkgs.openssl
      pkgs.webkitgtk
    ]}:$PKG_CONFIG_PATH
  '';
}

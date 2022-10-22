{ pkgs }: {
	deps = [
		pkgs.sqlite.bin
  pkgs.cowsay
		pkgs.unzip
		pkgs.vim
    pkgs.yarn
		pkgs.nodePackages.npm
	];
}
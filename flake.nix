{
  description = "sylvesterroos.com";

  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    flake-parts.url = "github:hercules-ci/flake-parts";
    devenv.url = "github:cachix/devenv";
  };

  outputs = inputs@{ flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.devenv.flakeModule
      ];

      systems = nixpkgs.lib.systems.flakeExposed;

      perSystem = { config, pkgs, system, ... }: {
        packages.default = pkgs.callPackage ./nix/package.nix { };

        devenv.shells.default = {
          imports = [ ./devenv.nix ];
        };
      };
    };
}
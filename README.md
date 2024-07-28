# SoMe-pi

## Instructions

Il faut que les composants suivants soient installés:
- Pour utiliser le backend:
    - juste rust
- Pour compiler en wasm:
    - Je sais pas si c'est nécessaire: wasm-pack (executer `cargo install wasm-pack` dans le dossier `backend`)
- Pour compiler le frontend:
    - Python 3
    - Cowtchoox (bien pull les derniers changements de la repo de cowtchoox, faire une build comme décrit dans la doc)

Le projet rust est dans le dossier `backend`.
Toutes les fonctions qui doivent être accessibles depuis JS doivent être dans `lib.rs`, doivent être publiques et avec `#[wasm_bindgen]` avant.

Pour tester les fonctions, il faut utiliser le fichier `main.rs` puis appeler `cargo run`. Attention `main.rs` est appelé uniquement pour les tests, et ne sera pas exécuté sur la page eb.

Pour compiler en WASM, executer `backend/build.bat`. Le compilateur va alors générer le dossier `web/wasm-gen`.

Le texte du site web est dans `web/main.cow`.
Pour compiler le site web, executer `web/run.bat`, il devrait s'ouvrir dans le navigateur.



## Notes

- Code JS Alexis
    - [github.com/Sergueille/courbes v2](https://github.com/Sergueille/courbes_v2)
- Cour barycentres
    - [Malartre_181](https://remnote-user-data.s3.amazonaws.com/WUTZaEHQBsdmHJbFBkMA0XZbzEthSdxilVl91v4m9eKUPiSo3BBkxNCkrGnyitYmxnbi9vX_tTG-RX5EAs0nwFPWPHhCNqRwsQXhoIM6dm3enmzkMKqO2R8uSpss4zHF.pdf) 
- Volume d'un simplexe
    - [Finding the volume of a simplex (straightforward method, no linear algebra) - YouTube](https://www.youtube.com/watch?v=o9hXjCpVB10)
    
  

- Trucs à prouver
    - Volume d'un simplex
    - calcul des coordonnée barycentriques
    - truc du threshold

- Un acticle intéressant
    - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3549276/

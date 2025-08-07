export function getGenero(genero) {
    switch (genero.toUpperCase()) {
    case 'Male'.toUpperCase():
        return 'Masculino'
    case 'Female'.toUpperCase():
        return 'Feminino'
    case 'unknown'.toUpperCase():
        return 'Desconhecido'
    case 'Genderless'.toUpperCase():
        return 'Sem Gênero'
    default:
        return genero
    }
}

export function getStatus(status) {
    switch (status.toUpperCase()) {
    case 'Alive'.toUpperCase():
        return 'Vivo'
    case 'Dead'.toUpperCase():
        return 'Morto'
    case 'unknown'.toUpperCase():
        return 'Desconhecido'
    default:
        return status
    }
}

export function getEspecie(especie) {
    switch (especie.toUpperCase()) {
    case 'Alien'.toUpperCase():
        return 'Alienígena'
    case 'Human'.toUpperCase():
        return 'Humano'
    case 'Robot'.toUpperCase():
        return 'Robo'
    case 'Disease'.toUpperCase():
        return 'Doença'
    case 'Humanoid'.toUpperCase():
        return 'Humanoide'
    case 'unknown'.toUpperCase():
        return 'Desconhecido'
    case 'Mythological Creature'.toUpperCase():
        return 'Criatura Mitológica'
    default:
        return especie
    }
}
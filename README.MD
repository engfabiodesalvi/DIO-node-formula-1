# API Fórmula 1

> **Modificado por:** Fabio Toledo Bonemer De Salvi para o bootcamp da DIO meu tudo Mobile Developer.\
> **Versão base:** Felipe Aguiar - Instrutor na DIO.

## Descrição

A API Fórmula 1 é uma aplicação inspirada no site oficial  da principal categoria de corrida de carros, o [Fórmula 1](https://www.formula1.com), e tem como objetivo fornecer e amazenar informações referentes às corridas e pilotos para os mais diversos propósitos.\
A base de utilizada para esta aplicação possui dados referêntes ao perído de 1950 a meados de 2024, sendo necessário a sua atualização por conta do projeto ter sido descontinuado. Os dados do projeto Ergast-F1 no formato CSV esta dispnível [neste link](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020).\
Utilize a api do projeto [Jolpica-F1](https://api.jolpi.ca/ergast/f1/) para obter os dados atualizados da Fórmula 1 a partir 1950.
Com a API Fórmula 1 é possível utilizar os métodos **GET** (buscar), **POST** (inserir), **PUT** (inserir ou editar), **PATCH** (editar parcialmente) e **DELETE** (apagar) para as seguintes informações:

- **Corridas *(Races)*:** Informações referente às corridas como data, hora e circuito.
- **Pilotos *(Drivers)*:** Informações referente as pilotos como nome, numero e nacinalidade.
- **Construtores *(Constructors)*:** Informações referente aos construtores como nme e nacionalidade.
- **Classificação de pilotos *(Drivers standings)*:** Informações referente à classificação dos pilotos como pontos, posição e vitórias.
- **Classificação de construtores *(Constructors standings)*:** Informações referente à classificação de construtores como pontos, nome e nacinalidade.
- **Resultados das corridas sprint *(Sprint results)*:** Informações referente à corrida rápida realizada um dia antes da corrida principal. Reune informações do piloto, do construtor, corrida e status e agrega as informações de tempo, volta rápida e posição no grid.
- **Resultados das corridas *(Results)*:** Informações referente à corrida principal. Reune informações do piloto, do construtor, corrida e status e agrega as informações de tempo, volta rápida, posição no grid e classificação.
- **Resultados dos construtores *(Constructors results)*:** Informações referente as contrutores como corrida, construtor, pontos e status.
- **Qualificação *(Qualifying)*:** Informações referente a qualificação como corrida, piloto, construtor, numero, posição e tempos
- **Tempos de volta *(Tempos de volta)*:** Informações referente as tempos das voltas para cada corrida.
- **Paradas nos boxes *(pit stops)*:** Informações referente as tempos de cada para nos boxes.
- **Circuitos *(Circuits)*:** Informações referente aos ciruitos como nome, localização, país, latitude, longitude e altitude.
- **Temporadas *(Temporadas)*:** Infrmações referente às temporadas.
- **Status *(Status)*:** Informações diversas.

As informações acima pertencem a uma base de dados não relacional e possuem relação entre as tabelas através de índices.\
Algumas tabelas possuem chave composta para armazenar os dados.\
Deve-se seguir a seguinte relação entre as tabelas ao acessar ou modificar as informações:

![API Formula 1](./docs/arch/api_formula_1.png)



### Fonte dos dados desta API

CSV Formula 1 dataset 1950 - 2024 (Deprecated)
https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020

API that provides Formula 1 dataset 1950 - today
https://github.com/engfabiodesalvi/jolpica-f1
https://api.jolpi.ca/ergast/f1/

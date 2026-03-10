import { test, expect } from '@playwright/test';
import { request } from 'node:http';
import { json } from 'node:stream/consumers';

test('Consulta as reservas cadastradas', async ({ request }) => {
    //Faz request para a API e armazena a resposta
    const response = await request.get('/booking');

    //Exibe o corpo da resposta no console
    console.log(await response.json());

    // Verifica se a resposta foi bem-sucedida
    expect(response.ok()).toBeTruthy();

    // Verifica se o status code é 200
    expect(response.status()).toBe(200);
});

test('Consulta uma reserva específica', async ({ request }) => {
        // 🔵 Faz request para a API e armazena a resposta
    //// const response = await request.get('/booking/4604'); // depositpaid = true
    const response = await request.get('/booking/1911'); // depositpaid = false


        // 🔵 transforma a resposta em JSON e armazena em uma variável
    const jsonBody = await response.json();

        // 🔵 verifica se a resposta foi bem-sucedida
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

        // 🔵 verifica os dados da reserva estão corretos
    expect(jsonBody.firstname).toBe('Grace');
    expect(jsonBody.lastname).toBe('Ashcroft');
    expect(jsonBody.totalprice).toBe(255);
    expect(jsonBody.depositpaid).toBeFalsy();
    //// expect(jsonBody.depositpaid).toBeTruthy();
    expect(jsonBody.bookingdates.checkin).toBe('2026-02-28');
    expect(jsonBody.bookingdates.checkout).toBe('2026-03-06');

});

test('Consulta reserva cadastrada especifica e valida somente os campos', async ({ request }) => {
    // 🔵 Faz request para a API e armazena a resposta
    const response = await request.get('/booking/494'); // depositpaid = false
    const jsonBody = await response.json();

    // 🔵 verifica se a resposta foi bem-sucedida
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    console.log(await jsonBody);

    // 🔵 verifica os dados da reserva estão corretos
    expect(jsonBody).toHaveProperty('firstname');
    expect(jsonBody).toHaveProperty('lastname');
    expect(jsonBody).toHaveProperty('totalprice');
    expect(jsonBody).toHaveProperty('depositpaid');
    expect(jsonBody).toHaveProperty('bookingdates');
    expect(jsonBody.bookingdates).toHaveProperty('checkin');
    expect(jsonBody.bookingdates).toHaveProperty('checkout');
    expect(jsonBody).toHaveProperty('additionalneeds');
});

test('Cadastrar uma nova reserva', async ({ request }) =>{

    const response = await request.post('/booking', {
        data:{
            "firstname": "Leon",
            "lastname": "Kennedy",
            "totalprice": 187,
            "depositpaid": false,
            "bookingdates": {
                "checkin": "2026-03-07",
                "checkout": "2026-03-11"
            },
            "additionalneeds": "Double bed, breakfast, late checkout, free cancellation, free parking, airport shuttle, pets allowed"
        }
    });

    const jsonBody = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    expect(jsonBody.bookingid).toBeDefined();

    console.log(await 'id da nova reserva: ' + jsonBody.bookingid);
});

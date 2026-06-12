export const calcularValorTotal = (
    valorConsulta,
    porcentajeDescuento,
    esParticular
) => {

    if (esParticular === 1) {
        return Number(valorConsulta);
    }

    return (
        Number(valorConsulta) -
        (
            Number(valorConsulta) *
            Number(porcentajeDescuento) /
            100
        )
    );
};
export const trueValue = true;
export const apiUrlWihoutApi: string | any = process.env.NEXT_PUBLIC_API_URL_SOCKET

// chat tags
export const atendiendo = "Atendiendo";
export const queja = "Queja";
export const ventaFinalizada = "Venta finalizada";

export const tags = [
    {
        tag: atendiendo,
        class: "boxYellow",
        color: "#FFD700"
    }, 
    {
        tag: queja,
        class: "boxRed",
        color: "#FF6347"
    }, 
    {
        tag: ventaFinalizada,
        class: "boxGreen",
        color: "#32CD32"
    }];
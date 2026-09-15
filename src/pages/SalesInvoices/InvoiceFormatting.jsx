export const getInvoiceValue = (
    object,
    ...keys
) => {

    for (const key of keys) {

        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {
            return object[key];
        }
    }

    return "";
};

export const formatInvoiceDate = value => {

    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN");
};

export const formatInvoiceDateTime = value => {

    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN");
};

export const formatInvoiceMoney = value => {

    return Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
};

export const getInvoiceId = invoice =>
    invoice?.SalesInvoiceId ??
    invoice?.salesInvoiceId;

export const getInvoiceNumber = invoice =>
    invoice?.InvoiceNumber ??
    invoice?.invoiceNumber ??
    "N/A";

export const getInvoiceCustomerName = (
    invoice,
    customer = {}
) => {

    return (
        getInvoiceValue(
            customer,
            "CustomerName",
            "customerName",
            "Name",
            "name",
            "CompanyName",
            "companyName"
        ) ||
        getInvoiceValue(
            invoice,
            "CompanyName",
            "companyName"
        ) ||
        "N/A"
    );
};
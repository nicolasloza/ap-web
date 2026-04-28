import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Operation } from "../../../types/property";

export function usePropertySearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [operation, setOperation] = useState<"" | Operation>("");

    const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const q = searchTerm.trim();
        const type = propertyType.trim();
        const params = new URLSearchParams();

        if (q) {
            params.set("q", q);
        }
        if (type) {
            params.set("type", type);
        }
        if (operation) {
            params.set("operation", operation);
        }
        if (!params.toString()) {
            navigate("/propiedades");
            return;
        }
        navigate(`/propiedades?${params.toString()}`);
    };

    return {
        searchTerm,
        propertyType,
        operation,
        setSearchTerm,
        setPropertyType,
        setOperation,
        onSearchSubmit,
    };
}

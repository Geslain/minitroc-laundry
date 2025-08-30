import {useEffect, useState} from "react";
import { useFormContext } from "react-hook-form";

type Props = {
    className?: string;
}

export default function ReviewCard({className} : Props) {
    const { watch } = useFormContext();
    const [labels, setLabels] = useState<{
        categoryLabels: Record<string, string>;
        brandLabels: Record<string, string>;
        genderLabels: Record<string, string>;
        seasonLabels: Record<string, string>;
        sizeLabels: Record<string, string>;
        stateLabels: Record<string, string>;
    }>({
        categoryLabels: {},
        brandLabels: {},
        genderLabels: {},
        seasonLabels: {},
        sizeLabels: {},
        stateLabels: {}
    });

    useEffect(() => {
        import("@/lib/product").then((module) => {
            setLabels({
                categoryLabels: module.categoryLabels,
                brandLabels: module.brandLabels,
                genderLabels: module.genderLabels,
                seasonLabels: module.seasonLabels,
                sizeLabels: module.sizeLabels,
                stateLabels: module.stateLabels
            });
        });
    }, []);

    const formValues = watch();

    return (
        <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className}`}>
            <dl className="divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Nom:</dt>
                    <dd className="text-gray-900">{formValues.name}</dd>
                </div>

                {formValues.description && (
                    <div className="py-2 flex justify-between">
                        <dt className="font-medium text-gray-500">Description:</dt>
                        <dd className="text-gray-900">{formValues.description}</dd>
                    </div>
                )}

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Catégorie:</dt>
                    <dd className="text-gray-900">{labels.categoryLabels[formValues.category] || "-"}</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Marque:</dt>
                    <dd className="text-gray-900">{labels.brandLabels[formValues.brand] || "-"}</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">État:</dt>
                    <dd className="text-gray-900">{labels.stateLabels[formValues.state] || "-"}</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Genre:</dt>
                    <dd className="text-gray-900">{labels.genderLabels[formValues.gender] || "-"}</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Taille:</dt>
                    <dd className="text-gray-900">{labels.sizeLabels[formValues.size] || "-"}</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Saison:</dt>
                    <dd className="text-gray-900">{labels.seasonLabels[formValues.season] || "-"}</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Prix:</dt>
                    <dd className="text-gray-900 font-bold">{formValues.price}€</dd>
                </div>

                <div className="py-2 flex justify-between">
                    <dt className="font-medium text-gray-500">Photo:</dt>
                    <dd className="text-gray-900">
                        {formValues.photo ? "✓ Photo ajoutée" : "✗ Pas de photo"}
                    </dd>
                </div>
            </dl>
        </div>
    )
}
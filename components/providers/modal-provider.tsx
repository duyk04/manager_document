"use client";

import { useEffect, useState } from "react";
import { CreateFieldDocumentModal } from "@/components/modals/creat-department-modal";
import { EditAccountModal } from "@/components/modals/edit-account-modal";
import { EditDepartmentModal } from "@/components/modals/edit-department-modal";
import { DeleteDepartmentModal } from "@/components/modals/delete-department-modal";
import { CreateDepartmentModal } from "@/components/modals/creat-fieldDocument-modal";
import { EditFieldDocumentModal } from "@/components/modals/edit-fieldDocument-modal";
import { DeleteFielDocumentModal } from "@/components/modals/delete-fieldDocument";


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <EditAccountModal />
            <CreateDepartmentModal />
            <EditDepartmentModal />
            <DeleteDepartmentModal />
            <CreateFieldDocumentModal />
            <EditFieldDocumentModal />
            <DeleteFielDocumentModal/>
        </>
    );
};


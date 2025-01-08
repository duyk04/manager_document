"use client";

import { useEffect, useState } from "react";
import { CreateDepartmentModal } from "@/components/modals/creat-department-modal";
import { EditAccountModal } from "@/components/modals/edit-account-modal";
import { EditDepartmentModal } from "../modals/edit-department-modal";
import { DeleteDepartmentModal } from "../modals/delete-department-modal";


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
        </>
    );
};


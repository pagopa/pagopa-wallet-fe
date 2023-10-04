import React from "react";
import { Navigate } from "react-router-dom";
import utils from "../../utils";
import { CheckoutRoutes } from "../../routes/models/routeModel";
import { SessionItems } from "../../utils/storage";

export default function Guard(props: {
  item: SessionItems;
  children?: React.ReactNode;
}) {
  return !utils.storage.load(props.item) ? (
    <Navigate to={CheckoutRoutes.SCEGLI_METODO} />
  ) : (
    <>{props.children}</>
  );
}

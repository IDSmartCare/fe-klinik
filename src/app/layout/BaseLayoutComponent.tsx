"use client";

import { listMenu } from "@/setup/menu";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const BaseLayoutComponent = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  return (
    <div className="flex-1">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col gap-2 p-2 mb-24">
          {children}
        </div>
        <div className="drawer-side lg:pl-2 lg:py-2">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-60 min-h-full lg:rounded bg-base-200 text-base-content">
            <div className="flex justify-center mb-2">
              <Link href={"/klinik"}>
                <Image
                  src={`/logo.png`}
                  priority
                  width={150}
                  height={100}
                  className="w-50 h-8"
                  alt="logo klinik"
                />
              </Link>
            </div>
            <div className="divider m-0"></div>
            {listMenu.map((item) => {
              // Check if the current user's role is allowed for the item
              if (!item.roles.includes(session?.user.role)) return null;

              if (
                item.menu === "Setting" &&
                session?.user.type === "Klinik" &&
                session?.user.role === "kasir"
              ) {
                return null; // Do not render the Setting menu
              }

              const isFreeApotekKasir =
                session?.user.role === "kasir" &&
                session?.user.package === "FREE" &&
                session?.user.type === "Apotek";

              // Show only "Kasir" menu with "POS" and "History POS" submenus for Free Apotek Kasir users
              if (isFreeApotekKasir && item.menu !== "Kasir") return null;

              return (
                <li key={item.id}>
                  {item.submenu && item.submenu.length > 0 ? (
                    <details>
                      <summary>
                        <Image
                          src={`data:image/svg+xml;utf8,${item.icon}`}
                          alt="icon-sidebar"
                          width={20}
                          height={20}
                        />
                        {item.menu}
                      </summary>
                      <ul>
                        {item.submenu
                          .filter((submenu) => {
                            // Conditions for Klinik type with kasir role
                            if (
                              session?.user.type === "Klinik" &&
                              session?.user.role === "kasir"
                            ) {
                              return item.menu === "Kasir"; // Show all submenus under Kasir
                            }

                            // Conditions for Apotek type with kasir role
                            if (
                              session?.user.type === "Apotek" &&
                              session?.user.role === "kasir"
                            ) {
                              // Show "Kasir" menu with specific submenus and "Setting" menu with "User Login"
                              if (item.menu === "Kasir") {
                                return ["POS", "History POS"].includes(
                                  submenu.title
                                ); // Show only specific submenus
                              }
                              if (item.menu === "Setting") {
                                return ["User Login"].includes(submenu.title); // Show Setting menu for Apotek type
                              }
                            }

                            // For other roles and types, show all submenus
                            return true;
                          })
                          .map((submenu) => (
                            <li className="m-1" key={submenu.id}>
                              <Link href={submenu.url}>{submenu.title}</Link>
                            </li>
                          ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={item.link}>
                      <Image
                        src={`data:image/svg+xml;utf8,${item.icon}`}
                        alt="icon-sidebar"
                        width={20}
                        height={20}
                      />
                      {item.menu}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BaseLayoutComponent;

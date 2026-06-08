{/* TIER 3: Category Bar - STICKY logic applied here */}
      <div
        className={`hidden lg:block w-full bg-background border-y border-border shadow-sm z-[1150] transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0" : "relative"
        }`}
      >
        <div
          className="mx-auto px-4 sm:px-[5%] xl:px-[8%] flex items-center justify-start gap-8"
          onMouseLeave={() => {
            setActiveMegaTab(null);
            setHasColumns(false);
          }}
        >
          {displayMenus.map((tab) => {
            const isActive = activeMegaTab === tab.key;
            const hasColumns = "columns" in tab;

            return (
              <button
                key={tab.key}
                onMouseEnter={() => {
                  setActiveMegaTab(tab.key);
                  setHasColumns(hasColumns);
                }}
                onClick={() => handleClick(tab)}
                className={`group relative py-4 text-[14px] font-medium transition-colors`}
              >
                <span>{tab.title}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[3px] bg-secondary transition-all duration-200 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </button>
            );
          })}

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {activeMegaTab && activeTab && hasColumns && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-[100%] w-full bg-background border-b border-border shadow-2xl"
                onMouseEnter={() => setActiveMegaTab(activeTab.key)}
              >
                <div className="mx-auto px-4 sm:px-[5%] xl:px-[8%] py-8">
                  {/* UPDATED: Handle Modular Kitchen Special Layout */}
                  {activeTab.isModular ? (
                    <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 justify-between">
                      {/* Left Info Panel */}
                      <div className="flex-1 max-w-md pt-2">
                        <h3 className="text-2xl sm:text-3xl text-foreground font-light mb-12 leading-snug">
                          Transform your home's style with our innovative{" "}
                          <span className="font-bold">Design</span>
                        </h3>

                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <Users strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              20,000+ happy customers
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <Wrench strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              Branded Hardware and Materials
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <ShieldCheck strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              Up to 10-years* material warranty
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-secondary mb-3">
                              <ClipboardList strokeWidth={1.5} size={32} />
                            </div>
                            <span className="text-[11px] font-medium text-muted px-2">
                              Stringent Quality Checks
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Promo Images */}
                      <div className="flex gap-6 flex-1">
                        <Link
                          href="/modular-kitchen"
                          className="group block flex-1"
                        >
                          <div className="rounded-lg overflow-hidden bg-surface mb-3 h-[240px]">
                            <img
                              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                              alt="Modular Kitchen"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-center font-medium text-foreground text-lg">
                            Modular Kitchen
                          </h4>
                          <p className="text-center text-muted text-sm mt-1">
                            Starting From Γé╣1,49,999
                          </p>
                        </Link>
                        <Link
                          href="/modular-wardrobe"
                          className="group block flex-1"
                        >
                          <div className="rounded-lg overflow-hidden bg-surface mb-3 h-[240px]">
                            <img
                              src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800"
                              alt="Modular Wardrobe"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-center font-medium text-foreground text-lg">
                            Modular Wardrobe
                          </h4>
                          <p className="text-center text-muted text-sm mt-1">
                            Starting From Γé╣49,999
                          </p>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // Standard Mega Menu Columns
                    <div className="flex gap-8 justify-between">
                      <div className="flex gap-12 flex-1 flex-wrap">
                        {activeTab.columns?.map((col, colIndex) => (
                          <div
                            key={colIndex}
                            className="flex flex-col gap-8 min-w-[160px]"
                          >
                            {col.sections.map((section, secIndex) => (
                              <div key={secIndex}>
                                <h4 className="mb-3 text-[14px] font-bold text-foreground">
                                  {section.heading}
                                </h4>
                                {/* UPDATED: Margin reduced to 3px spacing between links */}
                                <ul className="space-y-[3px]">
                                  {section.links.map((link) => (
                                    <li key={link.title}>
                                      <Link
                                        href={link.href}
                                        className="text-[13px] text-muted transition-colors hover:text-secondary"
                                      >
                                        {link.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {activeTab.promo && (
                        <div className="w-[300px] shrink-0 border-l border-border pl-8 hidden xl:block">
                          <Link
                            href={activeTab.promo.href || "#"}
                            className="block overflow-hidden rounded-md bg-surface group relative h-[350px]"
                          >
                            <img
                              src={activeTab.promo.img || ""}
                              alt="Category Promo"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      
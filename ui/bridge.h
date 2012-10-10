#ifndef _BRIDGE_H
#define _BRIDGE_H

#include <QObject>
#include <QWebView>
#include <iostream>
#include <QWebFrame>
#include <QNetworkInterface>

class Bridge : public QObject {
	Q_OBJECT
public:
	Bridge(QWebView *view) : QObject(view) {
		m_view = view;
	}
	public Q_SLOTS:
	void loaded(bool) {
		std::cout << "Got loaded signal\n";
		QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();
		Q_FOREACH(const QNetworkInterface &iface, interfaces) {
			QStringList addresses;
			Q_FOREACH(const QNetworkAddressEntry &address, iface.addressEntries()) {
				addresses << QString("\'") + address.ip().toString() + "\'";
			}
			exec(QString("ui_event('%1',%2)").arg("address").arg(
					QString("{ interface: '%1', addresses: [%2] }").arg(iface.humanReadableName()).arg(addresses.join(","))
				));
		}
	}
protected:
	void exec(const QString &s) {
		m_view->page()->mainFrame()->evaluateJavaScript(s);
	}
	QWebView *m_view;
};

#endif
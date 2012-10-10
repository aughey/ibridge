#include <QApplication>
#include <QWebView>
#include <QDir>
#include <QProcess>
#include "bridge.h"

int main(int argc, char *argv[])
{
   QApplication app(argc, argv);

   QProcess *node = new QProcess();
   node->start("node ../socks-client.js -s 'http://slice.washucsc.org:3001'");

   QWebView *view = new QWebView;
   Bridge *bridge = new Bridge(view);
   QObject::connect(view,SIGNAL(loadFinished(bool)),bridge,SLOT(loaded(bool)));

   view->setHtml("If you can see this, I couldn't find my index.html file.");

   QString curpath = QDir::currentPath();
#if(WIN32)
   // Work around for Windows case insensitive Qt 4.8 bug
   // https://bugreports.qt-project.org/browse/QTBUG-17529
   {
      LPSTR newpath = new char[256];
      ::GetLongPathName(curpath.toStdString().c_str(),newpath,256);
      curpath = newpath;
   }
#endif

   view->load(QUrl::fromLocalFile(curpath + "/html/index.html"));

   view->show();

   app.setQuitOnLastWindowClosed(false);
   int ret = app.exec();

   node->kill();
   node->waitForFinished();
   delete node;

   return ret;
}
